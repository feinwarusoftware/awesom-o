import { FastifyInstance } from "fastify";
import gql from "fastify-gql";

import {
  guildHandler,
  guildScriptHandler,
  scriptHandler,
  userHandler,
} from "./handlers";

import { schema, resolvers } from "./graphql";

export default async (fastify: FastifyInstance) => {  
  fastify.register(guildHandler, { prefix: "/guilds" });
  fastify.register(guildScriptHandler, { prefix: "/guilds/:guildId/scripts" });
  fastify.register(scriptHandler, { prefix: "/scripts" });
  fastify.register(userHandler, { prefix: "/users" });

  fastify.register(gql, { schema, resolvers });
  fastify.post("/gql", async (request, reply) => {
    const { query } = request.body;

    return reply.graphql(query);
  });
};
