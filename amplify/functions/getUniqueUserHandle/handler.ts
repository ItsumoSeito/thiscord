import type { APIGatewayProxyHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import { env } from '$amplify/env/get-unique-user-handle';

type QueryStringParameters = {
  base?: string;
};

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('event', event);

  const cognito = new AWS.CognitoIdentityServiceProvider();

  const { base } = event.queryStringParameters as QueryStringParameters;
  const userPoolId = env.USER_POOL_ID;

  let retries = 0;
  while (retries < 10) {
    const userHandle = `${base}-${Math.floor(Math.random() * 9999)}`;

    const params = {
      UserPoolId: userPoolId,
      Filter: `username = \"${userHandle}\"`,
      Limit: 1,
    };
    try {
      const data = await cognito.listUsers(params).promise();
      if (data.Users?.length === 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({ userHandle }),
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify(error),
      };
    }
  }
  return {
    statusCode: 409,
    body: JSON.stringify({
      error: {
        message: 'Failed to generate unique user handle after 10 retries',
        code: 'TOO_MANY_RETRIES',
      },
    }),
  };
};
