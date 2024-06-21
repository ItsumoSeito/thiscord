import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'The password must be at least 8 characters long')
  .refine(
    (value) => {
      // Regular expression to check for at least one digit, one lowercase, one uppercase, and one non-alphanumeric character
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
      return regex.test(value);
    },
    {
      message:
        'Password must contain at least one digit, one lowercase letter, one uppercase letter, and one non-alphanumeric character.',
    }
  );
