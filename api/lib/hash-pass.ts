import { compareSync, hashSync } from 'bcryptjs';

export const comparePassword = (userPassword: string, hashedPassword: string): boolean =>
  compareSync((userPassword || '').toString(), (hashedPassword || '').toString());

export const hashPassword = (password: string): string =>
  hashSync(password.toString(), 10);
