import { RouteHandlerMethod } from 'fastify';
export declare const blogPut: RouteHandlerMethod;
export declare const blogPutSchema: {
    params: {
        type: string;
        properties: {
            id: {
                type: string;
            };
        };
    };
    body: {
        type: string;
        properties: {
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
        required: any[];
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
