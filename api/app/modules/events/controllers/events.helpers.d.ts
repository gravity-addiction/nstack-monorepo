import { PoolConnection } from 'mysql2';
export declare const eventsGenerateShortId: (db?: PoolConnection) => Promise<string>;
export declare const sanitizeContent: (content: string) => string;
