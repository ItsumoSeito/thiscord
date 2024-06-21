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

import { Button } from '@/components/ui/button';
import { SignUpConfirmValues, formSchema } from './formSchema';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { useToast } from '@/components/ui/use-toast';

type ConfirmSignUpError = {
  name: string;
  recoverySuggestion: any;
  underlyingError: any;
  message: string;
  stack: string;
};

type Props = {
  userEmail: React.MutableRefObject<string>;
  setSignUpConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConfirmSignUpForm: React.FC<Props> = ({
  userEmail,
  setSignUpConfirmed,
}) => {
  const { toast } = useToast();
  const [allowResend, setAllowResend] = React.useState(false);
  const [resendLoading, setResendLoading] = React.useState(false);

  const form = useForm<SignUpConfirmValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: undefined,
    },
  });

  const submitHandler = async (values: SignUpConfirmValues) => {
    try {
      const response = await confirmSignUp({
        username: userEmail.current,
        confirmationCode: values.code,
      });
      console.log(response);

      if (response.isSignUpComplete) setSignUpConfirmed(true);
    } catch (err) {
      const error = err as ConfirmSignUpError;
      console.dir(error);
      switch (error.name) {
        case 'CodeMismatchException':
          form.setError(fields.code, { message: 'Invalid verification code' });
          break;
        case 'ExpiredCodeException':
          form.setError(fields.code, { message: 'Code is expired' });
          setAllowResend(true);
          break;
        default:
          toast({
            title: 'Error',
            description:
              'Something went wrong while confirming your sign up. Please try again.',
            variant: 'destructive',
          });
      }
    }
  };

  const handleCodeResend = async () => {
    setResendLoading(true);
    form.setValue(fields.code, '');
    try {
      await resendSignUpCode({ username: userEmail.current });
      setAllowResend(false);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Uh oh!',
        description:
          'Something went wrong while resending the code. Please try again.',
        variant: 'destructive',
      });
    }
    setResendLoading(false);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name={fields.code}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmation code</FormLabel>
              <FormControl>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!allowResend ? (
          <Button type="submit">Sign up</Button>
        ) : (
          <Button
            type="button"
            className="bg-teal-600 hover:bg-teal-500"
            onClick={handleCodeResend}
            loading={resendLoading}
          >
            Send new code
          </Button>
        )}
      </form>
    </FormProvider>
  );
};

export default ConfirmSignUpForm;
