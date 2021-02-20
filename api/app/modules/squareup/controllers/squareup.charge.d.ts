import { SquareupV2 } from '@typings/index';
import { PoolConnection, RowDataPacket } from 'mysql2';
export declare const runCharge: (charge: SquareupV2.ISquareupCharge, sandbox?: any) => Promise<SquareupV2.ISquareupChargeResponse>;
export declare const getCharges: (chargeToken: string, db?: PoolConnection) => Promise<RowDataPacket[]>;
