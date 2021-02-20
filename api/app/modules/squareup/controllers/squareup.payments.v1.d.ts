export declare const getPayment: (sqToken: any, location: string, id: string) => Promise<any>;
export declare const getPayments: (sqToken: any, location: string, begin: string, end: string) => Promise<any>;
export declare const getPaymentsNext: (sqToken: any, nextUrl: string) => Promise<any>;
export declare const getWebhookPaymentInfo: (body?: any) => void;
export declare const createPaymentUpserts: (d: any, dbName: string) => Promise<any>;
