import { RouteHandlerMethod } from 'fastify';
export declare const blogGet: RouteHandlerMethod;
export declare const blogGetSchema: {
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
                backgroundImage: {
                    type: string;
                };
                heading: {
                    type: string;
                };
                subHeading: {
                    type: string;
                };
                meta: {
                    type: string;
                };
                body: {
                    type: string;
                };
            };
        };
    };
};
