import * as lambda from 'aws-lambda';
import { handlerWrapper } from 'utils/wrapper';
import { signUp, login } from '../../services/auth/auth-service';

export const signUpHandler = async (event: lambda.APIGatewayProxyEvent): Promise<lambda.APIGatewayProxyResult> => {
    return handlerWrapper({}, async (dbCon) => {
        const { email, password } = JSON.parse(event.body);
        const token = await signUp(email, password, dbCon.manager);
        return { token };
    });
};

export const loginHandler = async (event: lambda.APIGatewayProxyEvent): Promise<lambda.APIGatewayProxyResult> => {
    return handlerWrapper({ cors: true }, async (dbCon) => {
        const { email, password } = JSON.parse(event.body);
        const token = await login(email, password, dbCon.manager);
        return { token };
    });
};
