import React from 'react';
import OnboardingForm from '../forms/OnboardingForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

const Onboarding = () => {
  return (
    <div className="flex flex-col justify-center pt-20 items-center grow gap-10 h-full">
      <div className="w-1/2 flex flex-col gap-4">
        <h1 className="text-6xl text-center">Welcome to Thiscord!</h1>
      </div>
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Just one more step...</CardTitle>
          <CardDescription>
            Please provide some of your personal information so we can adjust
            your experience perfectly to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
