import { GoogleRequests } from '@lib/google';
export declare const toColumnName: (num: number) => string;
export declare const pick: (_this: any, arr: any[]) => any;
export declare const getRegistrationCounts: (gReq: GoogleRequests, sheetId: string) => Promise<any>;
export declare const getRegistrationList: (gReq: GoogleRequests, sheetId: string, eventId: string) => Promise<any[]>;
export declare const getRegistrationListComplete: (gReq: GoogleRequests, sheetId: string) => Promise<any>;
export declare const getRegistrationQuery: (gReq: GoogleRequests, sheetId: string, shortId: string) => Promise<any>;
export declare const addRowWithHeaders: (gReq: GoogleRequests, sheetId: string, sheetTab: string, dataSet: any) => Promise<any>;
