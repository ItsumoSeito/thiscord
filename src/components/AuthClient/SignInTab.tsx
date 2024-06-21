'use client';

import React from 'react';
import { TabsContent } from '../ui/tabs';
import { tabs } from '.';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import SignInForm from '../forms/auth/SignInForm';

const SignInTab = () => {
  return (
    <TabsContent value={tabs.signIn}>
      <Card>
        <CardHeader>
          <CardTitle>Existing user</CardTitle>
          <CardDescription>
            Sign in to your existing account with email and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SignInTab;
