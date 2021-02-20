import { AuthGuard } from './auth.guard';
import { AuthAdminGuard } from './auth-admin.guard';

export const guards = [AuthGuard, AuthAdminGuard];

export * from './auth.guard';
export * from './auth-admin.guard';
