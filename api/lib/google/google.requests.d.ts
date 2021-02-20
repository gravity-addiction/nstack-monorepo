import { GoogleTokens } from './google.tokens';
export declare class GoogleRequests {
    tokens: GoogleTokens;
    constructor(tokens: GoogleTokens);
    batchGetRange(sheetid: string, range: string[], majorDimension?: string): Promise<any>;
    getRange(sheetid: string, range: string, majorDimension?: string): Promise<any>;
    getRangeList(sheetid: string, range: string[], majorDimension?: string): Promise<any>;
    appendRow(sheetid: string, range: string, values: any): Promise<any>;
    setRange(sheetid: string, range: string, values: any): Promise<any>;
    getRequest(token: string, host: string, url: string): Promise<any>;
    postRequest(token: string, host: string, url: string, post: any): Promise<any>;
    putRequest(token: string, host: string, url: string, post: any): Promise<any>;
}
