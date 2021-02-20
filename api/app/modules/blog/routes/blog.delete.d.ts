import { RouteHandlerMethod } from 'fastify';
export declare const blogDelete: RouteHandlerMethod;
export declare const blogDeleteSchema: {
    params: {
        type: string;
        properties: {
            id: {
                type: string;
            };
        };
    };
    response: {
        204: {
            description: string;
            type: string;
        };
    };
};
