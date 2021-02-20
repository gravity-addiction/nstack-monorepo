export declare const addWebhook: (sqToken: any, location: string) => Promise<any>;
export declare const removeWebhook: (sqToken: any, location: string) => Promise<any>;
export declare const processWebhook: (body: any, dbName: string, sqToken?: any) => Promise<any>;
