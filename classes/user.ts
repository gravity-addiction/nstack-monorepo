export * from '../typings/user';

export class User {
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

  constructor(data: any = {}) {
    this.id = data.id || 0;
    this.sdobn = data.sdobn || '';
    this.user = data.user || {};
    this.name = data.name || '';
    this.firstname = data.firstname || '';
    this.lastname = data.lastname || '';
    this.email = data.email || '';
    this.username = data.username || '';
    this.birthdate = data.birthdate || '';
    this.role = data.role || '';
    this.password = data.password || '';
    this.photoUrl = data.photoUrl || '';
    this.authToken = data.authToken || '';
    this.provider = data.provider || '';
    this.providerId = data.providerId || '';
    this.providerToken = data.providerToken || '';
  }
}
