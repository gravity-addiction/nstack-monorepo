import { RouteHandlerMethod } from 'fastify';
export declare const blogPost: RouteHandlerMethod;
export declare const blogPostSchema: {
    response: {
        201: {
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
