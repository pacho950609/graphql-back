import { ApolloServer } from 'apollo-server-lambda';
import { buildSchema } from 'graphql';
import { readFileSync } from 'fs';
import { join } from 'path';
import { queries } from 'queries/queries';
import { mutations } from 'mutations/mutations';

const schema = buildSchema(readFileSync(join('./', 'lib', 'schemas', 'schemas.graphql'), 'utf-8'));

const server = new ApolloServer({
    typeDefs: schema,
    resolvers: {
        Query: {
            ...queries,
        },
        Mutation: {
            ...mutations,
        },
    },
});

exports.graphqlHandler = server.createHandler({
    expressGetMiddlewareOptions: {
        cors: {
            origin: '*',
            credentials: true,
        },
    },
});
