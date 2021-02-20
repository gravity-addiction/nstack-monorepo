export interface ILogin {
  username: string;
  password: string;
}
export interface ILoginResponse {
  _body: string;
  headers: any;
  ok: boolean;
  status: number;
  statusText: string;
  type: number;
  url: string;
}
export interface ILoginToken {
  idToken: string;
}
export interface ILoginJWT {
  id: number;
  name: string;
}

