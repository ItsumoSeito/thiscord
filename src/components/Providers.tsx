'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import config from '@/../amplify_outputs.json';
import { useStore } from '@/lib/store';
import { Hub } from 'aws-amplify/utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

Amplify.configure(config, { ssr: true });
const existingConfig = Amplify.getConfig();
Amplify.configure(
  {
    ...existingConfig,
    API: {
      ...existingConfig.API,
      REST: config.custom.API,
    },
  },
  { ssr: true }
);

type Props = {
  isLoggedIn: boolean;
};

const Providers: React.FC<Props & PropsWithChildren> = ({
  children,
  isLoggedIn,
}) => {
  const { setIsLoggedIn } = useStore();
  const queryClient = new QueryClient();

  // Set initial auth state
  useEffect(() => {
    console.log('Setting initial auth state', isLoggedIn);
    setIsLoggedIn(isLoggedIn);
  }, [isLoggedIn, setIsLoggedIn]);

  // Listen for auth events
  useEffect(() => {
    const authUnsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          setIsLoggedIn(true);
          break;
        case 'signedOut':
          setIsLoggedIn(false);
          break;
        default:
      }
    });

    return () => authUnsubscribe();
  }, [setIsLoggedIn]);

  return (
    <Authenticator.Provider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Authenticator.Provider>
  );
};

export default Providers;
