import { z } from 'zod';
import { passwordSchema } from '../shared/validation';
import { fields } from '../shared/fields';

// TODO: Add existing email check

export type SignUpFormValues = z.infer<typeof formSchema>;

export const formSchema = z
  .object({
    email: z.string().email(),
    password: passwordSchema,
    passwordRepeat: z.string(),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    path: [fields.passwordRepeat],
    message: 'Passwords do not match',
  });
