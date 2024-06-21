import * as AuthServer from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from './runWithAmplifyServerContext';
import { cookies } from 'next/headers';
import { UserAttributes } from '@/lib/models/user.model';

export const isAuthenticated = async () => {
  return await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec) {
      try {
        const user = await AuthServer.getCurrentUser(contextSpec);
        return !!user;
      } catch (err) {
        return false;
      }
    },
  });
};

export const isOnboardingComplete = async () => {
  const attributes = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec) {
      return await AuthServer.fetchUserAttributes(contextSpec);
    },
  });
  return attributes[UserAttributes.onboardingComplete] === 'true';
};
