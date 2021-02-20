import { ResultsRecordUSPA } from '@typings/records';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';
export declare const toResultsRecordUSPA: (r: RowDataPacket) => ResultsRecordUSPA;
export declare const getRecordsById: (id: number, db?: PoolConnection) => Promise<ResultsRecordUSPA>;
export declare const getRecordsByRecordno: (recordno: string | string[], db?: PoolConnection) => Promise<ResultsRecordUSPA[]>;
export declare const putRecordByRecordno: (recordno: string | string[], data: any, db?: PoolConnection) => Promise<ResultSetHeader>;
export declare const getRecordsByState: (abbr: string, db?: PoolConnection) => Promise<ResultsRecordUSPA[]>;
export declare const getRecordsByPerson: (id: number, db?: PoolConnection) => Promise<ResultsRecordUSPA[]>;
