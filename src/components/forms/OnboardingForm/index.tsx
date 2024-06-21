'use client';

import React, { FocusEventHandler, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';

import { Button } from '@/components/ui/button';
import { ProfileInformationValues, formSchema } from './formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { fields } from './fields';
import { Input } from '@/components/ui/input';
import DatePicker from '@/components/ui/DatePicker';
import { AtSignIcon } from 'lucide-react';
import * as Auth from '@aws-amplify/auth';
import { UserAttributes } from '@/lib/models/user.model';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useGetUniqueUserHandle } from '@/lib/hooks/query/user/useGetUniqueUserHandle';

type Props = {};

const OnboardingForm: React.FC<Props> = () => {
  const { toast } = useToast();
  const router = useRouter();

  const lastDisplayName = useRef<string | undefined>(undefined);

  const {
    mutateAsync: getUniqueUserhandle,
    isPending: getUniqueUserHandleIsPending,
  } = useGetUniqueUserHandle();

  const form = useForm<ProfileInformationValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: undefined,
      userHandle: undefined,
      birthDate: undefined,
    },
  });

  const submitHandler = async (values: ProfileInformationValues) => {
    try {
      await Auth.updateUserAttributes({
        userAttributes: {
          [UserAttributes.displayName]: values.displayName,
          [UserAttributes.handle]: values.userHandle,
          birthdate: format(values.birthDate!, 'MM-dd-yyyy'),
          [UserAttributes.onboardingComplete]: 'true',
        },
      });
      router.refresh();
    } catch (err) {
      toast({
        title: "Couldn't update user information",
        description: 'Something went wrong while updating your information',
        variant: 'destructive',
      });
      console.error(err);
    }
  };

  const updateUserHandle: FocusEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const displayNameValid = !form.getFieldState(fields.displayName).error;
    const displayName = event.target.value;
    if (displayNameValid && displayName !== lastDisplayName.current) {
      try {
        const { userHandle } = await getUniqueUserhandle({ base: displayName });
        form.setValue(fields.userHandle, userHandle);
        lastDisplayName.current = displayName;
      } catch (err) {
        console.error(err);
        toast({
          title: 'Failed to generate user handle',
          description: 'Please try another display name',
          variant: 'default',
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
          name={fields.displayName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input {...field} onBlur={updateUserHandle} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={fields.userHandle}
          render={({ field }) => (
            <FormItem>
              <FormLabel>User handle</FormLabel>
              <FormDescription>
                This is your unique user handle which your friends can find you
                with
              </FormDescription>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    {...field}
                    disabled
                    className="pl-8"
                    loading={getUniqueUserHandleIsPending}
                  />
                  <AtSignIcon className="absolute left-3 w-4 h-4 text-orange-500" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={fields.birthDate}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthdate</FormLabel>
              <FormControl>
                <DatePicker {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Confirm</Button>
      </form>
    </FormProvider>
  );
};

export default OnboardingForm;
