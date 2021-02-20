import { PoolConnection } from 'mysql2';
export declare const spotifyGenerateShortId: (serialNum: string, modelNum: string, revisionNum: string, db?: PoolConnection) => Promise<string>;
export declare const spotifyAccessTokenFetch: (code: string, db?: PoolConnection) => Promise<any>;
export declare const spotifyAccessTokenSave: (state: string, data: any, db?: PoolConnection) => Promise<any>;
