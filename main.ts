import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { typeDefs } from "./gql/schema.ts";
import mongoose from "mongoose";

// Deno Deploy: mgagog-gql.deno.dev/
const MONGO_URL = Deno.env.get("MONGO_URL");
const API_KEY = Deno.env.get("API_KEY");
if (!MONGO_URL || !API_KEY) {
  throw new Error("Please provide a MongoDB connection string and an API KEY");
}

// Connect to MongoDB
await mongoose.connect(MONGO_URL);

console.info("🚀 Connected to MongoDB");

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation
  },
});

const { url } = await startStandaloneServer(server);
console.info(`🚀 Server ready at ${url}`);


