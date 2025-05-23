import * as z from 'zod';

const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;

export const authValidationSchema = z.object({
    email: z
        .string({ message: 'Email must be a string' })
        .email()
        .regex(emailRegex),
    password: z
        .string({ message: 'Password must be a string' })
        .min(6, 'Password must have at least 6 characters'),
});
