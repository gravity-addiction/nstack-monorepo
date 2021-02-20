export declare const checkWebhookAuth: (body: any, secret: string, sandbox?: boolean) => boolean;
export declare const getWebhookPortalIdent: (body?: any) => {
    service: string;
    ident: string;
};
export declare const middlewareCreatePaymentUpserts: (sqToken: any, dbName: string, locationId: string, paymentId: string) => Promise<any>;
