'use client';

import React from 'react';
import { TabsContent } from '../ui/tabs';
import { tabs } from '.';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import SignUpForm from '../forms/auth/SignUpForm';
import ConfirmSignUpForm from '../forms/auth/ConfirmSignUpForm';
import { Button } from '../ui/button';

type Props = {
  setActiveTab: React.Dispatch<React.SetStateAction<tabs>>;
};

const SignUpTab: React.FC<Props> = ({ setActiveTab }) => {
  const userEmail = React.useRef<string | undefined>(undefined);
  const [signUpRequested, setSignUpRequested] = React.useState<boolean>(false);
  const [signUpConfirmed, setSignUpConfirmed] = React.useState<boolean>(false);

  const completeSignUpHandler = () => {
    setSignUpRequested(false);
    setSignUpConfirmed(false);
    setActiveTab(tabs.signIn);
  };

  let tabContent = (
    <Card>
      <CardHeader>
        <CardTitle>New user</CardTitle>
        <CardDescription>
          Create a new account with email and password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm
          userEmail={userEmail}
          setSignUpRequested={setSignUpRequested}
        />
      </CardContent>
    </Card>
  );

  if (signUpRequested && !signUpConfirmed) {
    tabContent = (
      <Card>
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We have sent a confirmation email to {userEmail.current}. Please
            check your inbox and enter the code we sent you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConfirmSignUpForm
            userEmail={userEmail as React.MutableRefObject<string>}
            setSignUpConfirmed={setSignUpConfirmed}
          />
        </CardContent>
      </Card>
    );
  }

  if (signUpRequested && signUpConfirmed) {
    tabContent = (
      <Card>
        <CardHeader>
          <CardTitle>You&#39;re in!</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Welcome to Thiscord. You have successfully signed up!
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Button onClick={completeSignUpHandler}>Sign in</Button>
        </CardFooter>
      </Card>
    );
  }

  return <TabsContent value={tabs.signUp}>{tabContent}</TabsContent>;
};

export default SignUpTab;
