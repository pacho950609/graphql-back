import * as lambda from 'aws-lambda';
import { Connection } from 'typeorm';
import { Database } from 'db/Database';
import { validateToken } from 'services/auth/auth-service';

export interface HandlerWrapperOptions {
    event: lambda.APIGatewayProxyEvent;
    cors: boolean;
}

export const HandlerWrapperDefaultOptions: HandlerWrapperOptions = {
    event: null,
    cors: false,
};

export const successfulResponse = (body: object, statusCode = 200): lambda.APIGatewayProxyResult => {
    return { statusCode, body: JSON.stringify(body) };
};

export const addCorsResponseHeaders = (response: lambda.APIGatewayProxyResult): lambda.APIGatewayProxyResult => {
    return Object.assign({}, response, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
    });
};

export const errorResponse = (errorMessage: string, statusCode = 500): lambda.APIGatewayProxyResult => {
    console.error('Error', errorMessage);
    return {
        statusCode,
        body: JSON.stringify({ error: errorMessage }),
    };
};

export const getHeaderToken = (headers: { [name: string]: string }): string => {
    if (!headers || !(headers.Authorization || headers.authorization)) {
        return null;
    }
    return headers.Authorization || headers.authorization;
};

export const handlerWrapper = async <T>(
    optionsParam: Partial<HandlerWrapperOptions>,
    operation: (connection: Connection, decodedToken?: string) => Promise<object>,
): Promise<lambda.APIGatewayProxyResult> => {
    const options = Object.assign({}, HandlerWrapperDefaultOptions);
    Object.assign(options, optionsParam);
    const database = new Database();

    try {
        const connection: Connection = await database.getConnection();
        let res;
        if (options.event) {
            // const token = getHeaderToken(options.event.headers);
            // let tokenId;
            // tokenId = await validateToken(token);
            res = await operation(connection);
        } else {
            res = await operation(connection);
        }

        if (options.cors) {
            return addCorsResponseHeaders(await successfulResponse(res, 200));
        }
        return successfulResponse(res, 200);
    } catch (e) {
        if (options.cors) {
            return addCorsResponseHeaders(await errorResponse(e.message ? e.message : e, e.code ? e.code : 500));
        }
        return errorResponse(e.message ? e.message : e, e.code ? e.code : 500);
    }
};
