import { UUID } from '@typings/index';
import { ResultsProfile } from '@typings/profile';
import { PoolConnection, RowDataPacket } from 'mysql2';
export declare const toResultsProfile: (r: RowDataPacket) => ResultsProfile;
export declare const getProfileByUUID: (uuid: UUID, db?: PoolConnection) => Promise<ResultsProfile>;
export declare const getProfileBySlug: (slug: UUID, db?: PoolConnection) => Promise<ResultsProfile>;
export declare const getProfileByKeywords: (keywords: string, db?: PoolConnection) => Promise<ResultsProfile[]>;
