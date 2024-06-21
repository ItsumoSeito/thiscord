import { z } from 'zod';

export type ProfileInformationValues = Partial<z.infer<typeof formSchema>>;

export const formSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .min(5, 'Display name must be at least 5 characters'),
  userHandle: z
    .string()
    .min(1, 'User handle is required')
    .min(5, 'User handle must be at least 5 characters'),
  birthDate: z.date().max(new Date(), 'Invalid date of birth'),
});
