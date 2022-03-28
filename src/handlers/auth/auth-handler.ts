import * as lambda from 'aws-lambda';
import { handlerWrapper } from 'utils/wrapper';
import { signUp, login } from '../../services/auth/auth-service';

/**
 * Create a new users
 * @param event 
 * @returns 
 */
export const signUpHandler = async (event: lambda.APIGatewayProxyEvent): Promise<lambda.APIGatewayProxyResult> => {
    return handlerWrapper({}, async (dbCon) => {
        const { email, password } = JSON.parse(event.body);
        const token = await signUp(email, password, dbCon.manager);
        return { token };
    });
};

/**
 * Validate user credentials and return a token
 * @param event 
 * @returns 
 */
export const loginHandler = async (event: lambda.APIGatewayProxyEvent): Promise<lambda.APIGatewayProxyResult> => {
    return handlerWrapper({ cors: true }, async (dbCon) => {
        const { email, password } = JSON.parse(event.body);
        const token = await login(email, password, dbCon.manager);
        return { token };
    });
};
