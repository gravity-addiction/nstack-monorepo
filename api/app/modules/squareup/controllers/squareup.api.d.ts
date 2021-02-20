export declare const iSODateString: (d: Date) => string;
export declare const getSquareupToken: (sandbox?: boolean | null) => any;
export declare const createEndpoint: (endpoint: string, location?: string | null, apiVersion?: string, sqToken?: any) => string;
export declare const createOAuthEndpoint: (sqToken?: any) => string;
export declare const squareupExecute: (sqToken: any, endpoint: string, method?: string, post?: any, squareVersion?: string | null) => Promise<any>;
