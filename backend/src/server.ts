import Fastify, { FastifyRequest, FastifyReply } from "fastify";
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
import { z } from "zod";
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

const PORT = Number(process.env.PORT || 3004);
const server = Fastify({ logger: true });

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

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

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const tmdbApiKey = process.env.TMDB_API_KEY || "";
const tmdbApiUrl = "https://api.themoviedb.org/3";

const searchTmdbByTitle = async (title: string) => {
  try {
    const searchUrl = `${tmdbApiUrl}/search/movie?query=${encodeURIComponent(
      title
    )}&language=pt-BR`;
    const res = await fetch(searchUrl, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${tmdbApiKey}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.results[0] || null;
  } catch (error) {
    server.log.error(error, `Falha ao buscar "${title}" no TMDB`);
    return null;
  }
};

server.withTypeProvider<ZodTypeProvider>().post(
  "/abstract-search",
  {
    preValidation: [server.authenticate ?? (async () => {})] as any,
    schema: {
      body: z.object({
        description: z.string().min(10).max(500),
      }),
    },
  },
  async (request, reply) => {
    const { description } = request.body;
    server.log.info(`Iniciando busca abstrata para: "${description}"`);

    if (!geminiApiKey || !tmdbApiKey) {
      server.log.error("GEMINI_API_KEY ou TMDB_API_KEY não configuradas.");
      return reply.code(500).send({ error: "Serviço não configurado" });
    }

    let movieTitles: string[] = [];
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${geminiApiKey}`;

      const systemPrompt = `Você é um especialista em cinema. Sua tarefa é ler a descrição do usuário e retornar 10 filmes que mais se encaixam nela.
Instruções:
1. Pense em 10 filmes relevantes.
2. Foque em filmes conhecidos ou cult, mas também em "jóias escondidas".
3. Retorne APENAS um objeto JSON.
4. O objeto JSON deve ter uma única chave: "movies".
5. O valor de "movies" deve ser um array de 10 strings, onde cada string é o título exato do filme (em inglês ou português, o que for mais comum).
Exemplo de Saída: {"movies": ["Jumanji", "Zathura: A Space Adventure", "Night at the Museum", "Goosebumps", "The House with a Clock in Its Walls", "Lemony Snicket's A Series of Unfortunate Events", "The Spiderwick Chronicles", "Percy Jackson & the Olympians: The Lightning Thief", "Stardust", "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe"]}`;

      const payload = {
        contents: [{ parts: [{ text: description }] }],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              movies: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
            },
            propertyOrdering: ["movies"],
          },
        },
      };

      const geminiRes = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!geminiRes.ok) {
        server.log.error(await geminiRes.text());
        throw new Error("Erro ao consultar a IA");
      }

      const geminiData = await geminiRes.json();
      const textResponse = geminiData.candidates[0].content.parts[0].text;
      const parsedJson = JSON.parse(textResponse);

      if (!parsedJson.movies || parsedJson.movies.length === 0) {
        throw new Error("IA não retornou filmes");
      }
      movieTitles = parsedJson.movies;
    } catch (error) {
      server.log.error(error, "Falha na lógica do Gemini");
      return reply
        .code(500)
        .send({ error: "Não foi possível gerar sugestões" });
    }

    try {
      const moviePromises = movieTitles.map(searchTmdbByTitle);
      const tmdbResults = await Promise.all(moviePromises);

      const validMovies = tmdbResults.filter((movie) => movie !== null);

      return reply.send(validMovies);
    } catch (error) {
      server.log.error(error, "Falha na lógica do TMDB");
      return reply.code(500).send({ error: "Erro ao buscar dados dos filmes" });
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
