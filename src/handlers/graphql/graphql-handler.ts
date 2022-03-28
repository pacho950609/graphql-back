import { ApolloServer } from 'apollo-server-lambda';
import { buildSchema } from 'graphql';
import { readFileSync } from 'fs';
import { join } from 'path';
import { queries } from 'queries/queries';
import { mutations } from 'mutations/mutations';
import { getHeaderToken } from 'utils/wrapper';
import { validateToken } from 'services/auth/auth-service';

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
    context: ({ event }) => {
        // Add userId to context if there is a authorization header
        const token = getHeaderToken(event.headers);
        if (token) {
            const userId = validateToken(token);
            return { userId };
        }
        return { userId: null };
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
