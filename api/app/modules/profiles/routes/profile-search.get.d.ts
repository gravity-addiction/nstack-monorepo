import { RouteHandlerMethod } from 'fastify';
export declare const profileSearchGet: RouteHandlerMethod;
export declare const profileSearchGetSchema: {
    params: {
        type: string;
        properties: {
            keywords: {
                type: string;
            };
        };
    };
    response: {
        200: {
            type: string;
            properties: {
                keywords: {
                    type: string;
                };
                results: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                            };
                            peopleId: {
                                type: string;
                            };
                            slug: {
                                type: string;
                            };
                            name: {
                                type: string;
                            };
                        };
                    };
                };
            };
        };
    };
};
