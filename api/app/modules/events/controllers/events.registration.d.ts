import { Registration, ResultsRegistration } from '@typings/event';
import { PoolConnection, RowDataPacket } from 'mysql2';
export declare const processEventsRegistration: (regList: any, db?: PoolConnection) => Promise<any>;
export declare const ngRegistration: (r: RowDataPacket | ResultsRegistration) => Registration;
export declare const dbRegistration: (r: RowDataPacket | ResultsRegistration) => ResultsRegistration;
export declare const dbRegistrations: (r: RowDataPacket[]) => ResultsRegistration[];
