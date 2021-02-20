import { RouteHandlerMethod } from 'fastify';
export declare const profileGet: RouteHandlerMethod;
export declare const profileGetSchema: {
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
                slug: {
                    type: string;
                };
                name: {
                    type: string;
                };
                peopleId: {
                    type: string;
                };
            };
        };
    };
};
