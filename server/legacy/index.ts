import { GraphQLServer } from "graphql-yoga";
import pgDb from "src/db/pg";
import prisma from "src/db/prisma";
import Middlewares from "./middleware";
import resolvers, { schemaDirectives } from "./resolvers";
import CustomRouter from "./routes/custom";
import typeDefs from "./typedefs";

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: (req) => ({
    ...req,
    db: prisma,
    pgDb,
  }),
  schemaDirectives,
  resolverValidationOptions: {
    // this is set due to this error => Type "Node" is missing a "__resolveType" resolver.
    // Pass false into "resolverValidationOptions.requireResolversForResolveType" to disable this warning.
    requireResolversForResolveType: false 
  },
  middlewares: [Middlewares.AuthMiddleware],
});

server.express.use("/", CustomRouter);

server.start(
    { 
      port: process.env.PORT, 
      endpoint: "/api",
    }, () => {
    console.log(
      `GraphQL server is running on http://localhost:${process.env.PORT}`
    );
});
