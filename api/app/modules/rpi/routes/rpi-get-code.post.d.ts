import { RouteHandlerMethod } from 'fastify';
export declare const rpiGetCodePost: RouteHandlerMethod;
export declare const rpiGetCodePostSchema: {
    request: {
        type: string;
        properties: {
            s: {
                type: string;
            };
            m: {
                type: string;
            };
            r: {
                type: string;
            };
            e4: {
                type: string;
            };
            e6: {
                type: string;
            };
            w4: {
                type: string;
            };
            w6: {
                type: string;
            };
        };
    };
    response: {
        201: {
            type: string;
        };
    };
};
