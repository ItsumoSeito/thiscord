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
import { SignUpFormValues, formSchema } from './formSchema';
import { Button } from '@/components/ui/button';
import { AuthError, signUp } from 'aws-amplify/auth';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
  userEmail: React.MutableRefObject<string | undefined>;
  setSignUpRequested: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignUpForm: React.FC<Props> = ({ userEmail, setSignUpRequested }) => {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: undefined,
      password: undefined,
      passwordRepeat: undefined,
    },
    mode: 'onBlur',
  });
  const { toast } = useToast();

  // TODO: add handler for existing user
  const submitHandler = async (values: SignUpFormValues) => {
    try {
      userEmail.current = values.email;
      await signUp({
        username: values.email,
        password: values.password,
      });

      setSignUpRequested(true);
    } catch (err) {
      const error = err as AuthError;
      console.error(error);
      if (error?.name === 'UsernameExistsException') {
        form.setError(fields.email, {
          type: error.name,
          message: 'E-Mail already exists',
        });
      } else {
        toast({
          title: 'Error',
          description:
            'Something went wrong while signing up. Please try again.',
          variant: 'destructive',
          duration: 5000,
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
        <FormField
          control={form.control}
          name={fields.passwordRepeat}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign up</Button>
      </form>
    </FormProvider>
  );
};

export default SignUpForm;
