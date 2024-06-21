import { z } from 'zod';
import { passwordSchema } from '../shared/validation';

export type SignInFormValues = z.infer<typeof formSchema>;

export const formSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});
