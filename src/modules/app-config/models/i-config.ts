export interface IConfig {
  apiServer?: string;
  apiPath?: string;
  authTokenKey?: string;
  authCollectionKey?: string;
  authCollectionId?: string;
  authCollectionPersistId?: string;
  recaptchaKey?: string;

  videoTimesheetSettings: any;
  videoInfractions: any;

  sqUseSandbox: boolean;
  sqSandbox: any;
  sqProduction: any;
}
