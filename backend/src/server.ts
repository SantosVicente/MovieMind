import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();

declare module "fastify" {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}

import prisma from "./prisma";
import authPlugin from "./auth";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const PORT = Number(process.env.PORT || 3004);
const server = Fastify({ logger: true });

server.register(fastifyCors, { origin: true });

if (!process.env.JWT_SECRET) {
  server.log.warn(
    "JWT_SECRET not set. Using fallback insecure secret for dev."
  );
  process.env.JWT_SECRET = "dev-secret";
}
server.register(fastifyJwt, { secret: process.env.JWT_SECRET });

server.register(fastifySwagger, {
  swagger: {
    info: {
      title: "MovieMind API",
      description:
        "API para autenticação via Google OAuth e gerenciamento de aplicativo web de filmes",
      version: "1.0.0",
    },
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});
server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
});

server.register(authPlugin);

server.decorate("authenticate", async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

server.get("/auth/google/callback", async (request, reply) => {
  // @ts-ignore
  const google = server["googleOAuth2"];
  if (!google) {
    return reply.code(500).send({ error: "OAuth plugin não configurado" });
  }

  const token = await google.getAccessTokenFromAuthorizationCodeFlow(request);
  const access_token = token.token.access_token;
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const profile = await res.json();

  if (!profile.sub || !profile.email) {
    return reply
      .code(400)
      .send({ error: "Não foi possível obter dados do Google" });
  }

  const user = await prisma.user.upsert({
    where: { googleId: profile.sub },
    update: {
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    },
    create: {
      googleId: profile.sub,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    },
  });

  const tokenJwt = await reply.jwtSign({
    userId: user.id,
    email: user.email,
  });

  const FRONT_URL = process.env.FRONT_URL || "http://localhost:3001";
  return reply.redirect(`${FRONT_URL}/auth/success?token=${tokenJwt}`);
});

server.get(
  "/me",
  { preValidation: [server.authenticate] } as any,
  async (request, reply) => {
    try {
      const userToken = (request as any).user;

      server.log.info({ userToken }, "Payload do token recebido na rota /me");

      if (!userToken || typeof userToken.userId === "undefined") {
        server.log.warn("Token JWT não continha 'userId'");
        return reply.code(400).send({ error: "Payload do token inválido" });
      }

      const userId = Number(userToken.userId);

      server.log.info(`Buscando usuário com ID: ${userId}`);

      if (isNaN(userId)) {
        server.log.error(
          "ID do usuário é 'NaN'. O token pode estar malformado."
        );
        return reply.code(400).send({ error: "ID de usuário inválido" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        server.log.warn(`Usuário com ID ${userId} não encontrado no banco.`);
        return reply.code(404).send({ error: "Usuário não encontrado" });
      }
      return user;
    } catch (err) {
      server.log.error(err, "ERRO CRÍTICO na rota /me");

      return reply.code(500).send({ error: "Erro interno do servidor" });
    }
  }
);

const start = async () => {
  try {
    await server.listen({ port: PORT, host: "0.0.0.0" });
    server.log.info(`Server rodando em http://localhost:${PORT}`);
    server.log.info(`Docs Swagger em http://localhost:${PORT}/docs`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
