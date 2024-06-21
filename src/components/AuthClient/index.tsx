'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import SignUpTab from './SingUpTab';
import SignInTab from './SignInTab';

export enum tabs {
  signIn = 'signIn',
  signUp = 'signUp',
}

const AuthClient = () => {
  const [activeTab, setActiveTab] = React.useState<tabs>(tabs.signIn);

  return (
    <Tabs
      className="w-96"
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as tabs)}
    >
      <TabsList className="w-full">
        <TabsTrigger value={tabs.signIn} className="w-1/2">
          Sign In
        </TabsTrigger>
        <TabsTrigger value={tabs.signUp} className="w-1/2">
          Sign Up
        </TabsTrigger>
      </TabsList>
      <SignInTab />
      <SignUpTab setActiveTab={setActiveTab} />
    </Tabs>
  );
};

export default AuthClient;
