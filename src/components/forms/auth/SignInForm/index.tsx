'use client';

import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../ui/form';
import { fields } from '../shared/fields';
import { Input } from '@/components/ui/input';
import { SignInFormValues, formSchema } from './formSchema';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Auth from 'aws-amplify/auth';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

const SignInForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: undefined,
      password: undefined,
    },
  });

  const submitHandler = async (values: SignInFormValues) => {
    try {
      const result = await Auth.signIn({
        username: values.email,
        password: values.password,
      });
      if (result.isSignedIn) {
        toast({ title: 'Sign in successful', variant: 'success' });
        router.refresh();
      }
    } catch (err) {
      const error = err as Auth.AuthError;
      console.error(error);
      if (error.name === 'NotAuthorizedException') {
        form.setError(fields.password, {
          message: 'Invalid email or password',
        });
      }
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name={fields.email}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={fields.password}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign in</Button>
      </form>
    </FormProvider>
  );
};

export default SignInForm;
