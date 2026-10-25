import { z } from 'zod';

const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

export const registerDTO = z.object({
    email: emailSchema,
    name: z.string().trim().min(3).max(20),
    password: z.string().trim().min(8).max(16),
    provider: z.enum(['local', 'google', 'facebook']).default('local'),
    dob: z.coerce.date().optional(),
    gender: z.enum(['male', 'female']).optional(),
});

export const verifyAccountDTO = z.object({
    email: emailSchema,
    code: z.string().trim().length(6),
});

export const loginDTO = z.object({
    email: emailSchema,
    password: z.string().trim().min(8).max(16),
});

export const  senddtoDTO = z.object({
    email: emailSchema,
});

export const resetPasswordDTO = z.object({
    email: emailSchema,
    code: z.string().trim().length(6),
    newPassword: z.string().trim().min(8).max(16),
});

export const googleLoginDTO = z.object({
    idToken: z.string().min(1),
});
