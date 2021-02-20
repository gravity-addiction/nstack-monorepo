export interface ResultsUser {
  id: UUID;
  firstName: string;
  lastName: string;
  email: Email;
}

/* Read */

export interface ReadUserParams {
  id: UUID;
}

export type ReadUserErrorCodes = 'USER_NOT_FOUND' | 'ERROR_FINDING_USER';

export interface IUser {
  id: number;
  sdobn: string;
  name?: string;
  firstname: string;
  lastname?: string;
  email: string;
  username: string;
  birthdate?: string;
  role: string;
  password?: string;
  oldpassword?: string;
  user?: any;
  photoUrl?: string;
  authToken?: string;
  provider?: string;
  providerId?: string;
  providerToken?: string;
}

export interface INewUser extends IUser {
  password: string;
}

export interface INewUser extends IUser {
  password: string;
}
