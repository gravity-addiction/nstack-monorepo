import { RouteHandlerMethod } from 'fastify';
export declare const eventsPost: RouteHandlerMethod;
export declare const eventsPostSchema: {
    response: {
        201: {
            type: string;
            properties: {
                active: {
                    type: string;
                };
                short_id: {
                    type: string;
                };
                registration_html: {
                    type: string;
                };
            };
        };
    };
};
