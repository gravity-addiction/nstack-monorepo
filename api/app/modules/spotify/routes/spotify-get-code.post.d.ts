import { RouteHandlerMethod } from 'fastify';
export declare const spotifyGetCodePost: RouteHandlerMethod;
export declare const spotifyGetCodePostSchema: {
    response: {
        201: {
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
            };
        };
    };
};
