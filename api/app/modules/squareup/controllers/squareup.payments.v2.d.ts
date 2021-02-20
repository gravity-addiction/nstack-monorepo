export declare const getPayment: (sqToken: any, location: string, id: string) => Promise<any>;
export declare const getPayments: (sqToken: any, querystring: any) => Promise<any>;
export declare const getPaymentsNext: (sqToken: any, nextUrl: string) => Promise<any>;
export declare const getWebhookPaymentInfo: (body?: any) => void;
