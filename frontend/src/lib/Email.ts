import { z } from 'zod';

export function isValidEmailAddress(email: string) {
  const result = z.email().safeParse(email);
  return result.success;
}