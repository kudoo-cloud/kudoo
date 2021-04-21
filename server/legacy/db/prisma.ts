import path from "path";
import { Prisma } from "prisma-binding";
export * from "../../prisma/generated/prisma-client/index";

export default new Prisma({
  typeDefs: path.resolve(__dirname, "../../prisma/generated/schema.graphql"),
  endpoint: process.env.PRISMA_ENDPOINT,
});
