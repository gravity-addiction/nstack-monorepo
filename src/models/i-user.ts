export interface IUser {
  id: number;
  firstname: string;
  lastname?: string;
  email: string;
  username: string;
  role: string;
  password?: string;
}

export interface INewUser extends IUser {
  password: string;
}
