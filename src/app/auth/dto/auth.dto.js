import { email, z } from 'zod';

export const registerDTO = z.object({
    email: z.email().lowercase().trim(),
    name: z.string().min(2).max(20).trim(),
    password: z.string().min(8).max(16).trim(),
    provider: z.enum(['local', 'google', 'facebook']).default('local'),
    dob: z.date().optional(),
    gender: z.enum(['male', 'female']).optional(),
});

export const verifyAccountDTO = z.object({
    email: z.email().lowercase().trim(),
    code: z.string().length(6).trim(),
});

export const loginDTO = z.object({
    email: z.email().lowercase().trim(),
    password: z.string().min(8).max(16).trim(),
});

export const  senddtoDTO = z.object({
    email: z.email().lowercase().trim(),
});

export const resetPasswordDTO = z.object({
    password: z.string().min(8).max(16).trim(),
    token: z.string().trim(),
    newPassword: z.string().min(8).max(16).trim(),
});