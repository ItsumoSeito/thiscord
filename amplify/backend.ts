import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { getUniqueUserHandle } from './functions/getUniqueUserHandle/resource';
import {
  AuthorizationType,
  Cors,
  LambdaIntegration,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { Stack } from 'aws-cdk-lib';
import { assignNewUserToGroup } from './functions/assignNewUserToGroup/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  getUniqueUserHandle,
  assignNewUserToGroup,
});

const apiStack = backend.createStack('api-stack');

// create a new REST API
const restApi = new RestApi(apiStack, 'RestApi', {
  restApiName: 'restApi',
  deploy: true,
  deployOptions: {
    stageName: 'dev',
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS, // Restrict this to domains you trust
    allowMethods: Cors.ALL_METHODS, // Specify only the methods you need to allow
    allowHeaders: Cors.DEFAULT_HEADERS, // Specify only the headers you need to allow
  },
});

// create new resource paths with IAM authorization
const userPath = restApi.root.addResource('user', {
  defaultMethodOptions: {
    authorizationType: AuthorizationType.IAM,
  },
});
const uniqueUserHandlePath = userPath.addResource('get-unique-user-handle', {
  defaultMethodOptions: {
    authorizationType: AuthorizationType.IAM,
  },
});

// create a new Lambda integration
const getUniqueUserHandleIntegration = new LambdaIntegration(
  backend.getUniqueUserHandle.resources.lambda
);

// add methods you would like to create to the resource path
uniqueUserHandlePath.addMethod('POST', getUniqueUserHandleIntegration);

// add a proxy resource path to the API
uniqueUserHandlePath.addProxy({
  anyMethod: true,
  defaultIntegration: getUniqueUserHandleIntegration,
});

// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      [restApi.restApiName]: {
        endpoint: restApi.url,
        region: Stack.of(restApi).region,
        apiName: restApi.restApiName,
      },
    },
  },
});
