import { typeDefs } from "./graphql-schema";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { v1 as neo4j } from "neo4j-driver";
import { makeAugmentedSchema, neo4jgraphql } from "neo4j-graphql-js";
import dotenv from "dotenv";
import { IsAuthenticatedDirective } from "graphql-auth-directives";
// set environment variables from ../.env
dotenv.config();

//settign app as Express middleware
const app = express();

/*
 * Create an executable GraphQL schema object from GraphQL type definitions
 * including autogenerated queries and mutations.
 * Optionally a config object can be included to specify which types to include
 * in generated queries and/or mutations. Read more in the docs:
 * https://grandstack.io/docs/neo4j-graphql-js-api.html#makeaugmentedschemaoptions-graphqlschema
 */
// typedefs are coming from the graphql-schema & schema.grapql
// AugmentSchema auto generates Mutations and Queries
const schema = makeAugmentedSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    isAuthenticated: IsAuthenticatedDirective
  }
});

/*
 * Create a Neo4j driver instance to connect to the database
 * using credentials specified as environment variables
 * with fallback to defaults
 */
const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j",
    process.env.NEO4J_PASSWORD || "neo4j"
  )
);

/*
 * Create a new ApolloServer instance, serving the GraphQL schema
 * created using makeAugmentedSchema above and injecting the Neo4j driver
 * instance into the context object so it is available in the
 * generated resolvers to connect to the database.
 */
//! assuming our middleware has added a user object
//! to the requet if it si authenrticated
//! inject the reqiest object into the context
//! so it will be available in the resolver
const server = new ApolloServer({
  schema: schema,
  context: ({ req }) => {
    return {
      driver,
      req
    };
  },
  introspection: true,
  playground: true
});
//! then in the resolver check for the exisctence of the user object 
const resolvers = {
  Query: {
    Business(object, params, ctx, resolveInfo) {
      if (!ctx.req.user) {
        //request is not authenticated, throw an error
        throw new Error("request not authenticated");
      } else {
        // request is authenticated, fetch the data
        return neo4jgraphql(object, params, ctx, resolveInfo);
      }
    }
  }
};

// Specify port and path for GraphQL endpoint
const port = process.env.GRAPHQL_LISTEN_PORT || 4001;
const path = "/graphql";

/*
 * Optionally, apply Express middleware for authentication, etc
 * This also allows us to specify a path for the GraphQL endpoint
 */
server.applyMiddleware({ app, path });

app.listen({ port, path }, () => {
  console.log(`GraphQL server ready at http://localhost:${port}${path}`);
});
