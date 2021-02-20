import { GoogleRequests } from '@lib/google';
import { PoolConnection } from 'mysql2';
export declare const createGoogleChannel: (uuid: string, queryData: any, fileId: string, eventId?: number, db?: PoolConnection) => Promise<any>;
export declare const cancelGoogleChannel: (uuid: string, db?: PoolConnection) => Promise<any>;
export declare const googleChannelsStopFileWatch: (gReq: GoogleRequests, data: any) => Promise<any>;
export declare const getGoogleChannelByFileId: (fileId: string, db?: PoolConnection) => Promise<any>;
export declare const getGoogleChannelByEventId: (eventId: string, db?: PoolConnection) => Promise<any>;
