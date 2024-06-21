import { z } from 'zod';

export type SignUpConfirmValues = z.infer<typeof formSchema>;

export const formSchema = z.object({
  code: z.string().length(6, 'The code must be 6 characters long'),
});
