import { RouteHandlerMethod } from 'fastify';
export declare const recordsIdGet: RouteHandlerMethod;
export declare const recordIdGetSchema: {
    params: {
        type: string;
        properties: {
            id: {
                type: string;
            };
        };
    };
    response: {
        200: {
            type: string;
            properties: {
                id: {
                    type: string;
                };
                zone: {
                    type: string;
                };
                state: {
                    type: string;
                };
                subclass: {
                    type: string;
                };
                category: {
                    type: string;
                };
                record: {
                    type: string;
                };
                performance: {
                    type: string;
                };
                recordno: {
                    type: string;
                };
                uspaclass: {
                    type: string;
                };
                uspadate: {
                    type: string;
                };
                location: {
                    type: string;
                };
                holders: {
                    type: string;
                };
                notes: {
                    type: string;
                };
                status: {
                    type: string;
                };
            };
        };
    };
};
