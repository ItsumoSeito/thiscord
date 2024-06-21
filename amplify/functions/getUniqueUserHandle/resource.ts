import { defineFunction } from '@aws-amplify/backend';

export const getUniqueUserHandle = defineFunction({
  name: 'get-unique-user-handle',
  environment: {
    USER_POOL_ID: 'eu-central-1_4KLlnsWwF',
  },
});
