export declare const stripToken: (token: string) => string;
export declare const unstripToken: (token: string) => string;
export declare const insertToken: (user: string, jti: string, ip?: string, useragent?: string | string[]) => Promise<any>;
export declare const updateToken: (jti: string) => Promise<any>;
export declare const deleteToken: (jti: string) => Promise<any>;
export declare const findToken: (token: string) => Promise<any>;
export declare const signToken: (body: any) => string;
export declare const resignToken: (body: any) => string;
export declare const createToken: (body: any, ip?: string, useragent?: string | string[]) => Promise<string>;
export declare const getTokenInfo: (token: string, checkExpired?: boolean) => any;
export declare const validateToken: (token: string) => Promise<any>;
