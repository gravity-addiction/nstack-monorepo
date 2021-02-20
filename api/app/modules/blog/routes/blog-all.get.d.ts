import { RouteHandlerMethod } from 'fastify';
export declare const blogAllGet: RouteHandlerMethod;
export declare const blogAllGetSchema: {
    response: {
        200: {
            type: string;
            items: {
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
};
