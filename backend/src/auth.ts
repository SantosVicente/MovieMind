import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import oauthPlugin from "@fastify/oauth2";

export default fp(async (fastify: FastifyInstance) => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
    process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    fastify.log.warn(
      "Google OAuth credentials not found in env. OAuth disabled."
    );
    return;
  }

  fastify.register(oauthPlugin, {
    name: "googleOAuth2",
    scope: ["openid", "email", "profile"],
    credentials: {
      client: {
        id: GOOGLE_CLIENT_ID,
        secret: GOOGLE_CLIENT_SECRET,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/auth/google/login",
    callbackUri: GOOGLE_CALLBACK_URL,
  });
});
