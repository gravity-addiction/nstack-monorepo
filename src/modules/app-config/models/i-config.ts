export interface IConfig {
  apiServer?: string;
  apiPath?: string;
  authTokenKey?: string;
  authCollectionKey?: string;
  authCollectionId?: string;
  authCollectionPersistId?: string;
  recaptchaKey?: string;
  defaultTitle?: string[];

  [key: string]: any;
}
