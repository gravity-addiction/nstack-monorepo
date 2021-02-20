/* Auth */
export type AuthErrorCodes =
  | 'NOT_AUTHORIZED'
  | 'NO_USER'
  | 'BEARER_SCHEMA_REQUIRED'
  | 'ROUTE_NOT_CONFIGURED_FOR_AUTHORIZATION';

/* Login */

export interface LoginPayload {
  password: string;
}

export type LoginErrorCodes = 'EMAIL_NOT_FOUND' | 'INVALID_PASSWORD';


/* Token */

export type Token = string;

export interface TokenResponse {
  token: Token;
}

export interface DecodedToken extends UserForToken {
  exp: number;
  iat: number;
}

export interface UserForToken {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IAuth {
  username: string;
  password: string;
  rememberme?: boolean;
  recaptcha?: string;
}

