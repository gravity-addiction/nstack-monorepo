import { PoolConnection } from 'mysql2';
export declare const squareupOAuth: (queryCode: string, sqToken?: any, redirectUri?: string) => Promise<any>;
export declare const saveOAuthToken: (token: any) => Promise<import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader")>;
export declare const getOAuthToken: (merchantId: string, db?: PoolConnection) => Promise<string>;
