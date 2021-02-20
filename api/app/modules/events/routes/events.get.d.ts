import { RouteHandlerMethod } from 'fastify';
export declare const eventsGet: RouteHandlerMethod;
export declare const eventsGetSchema: {
    response: {
        200: {
            type: string;
            items: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    active: {
                        type: string;
                    };
                    user: {
                        type: string;
                    };
                    short_id: {
                        type: string;
                    };
                    slug: {
                        type: string;
                    };
                    sheet_id: {
                        type: string;
                    };
                    heading: {
                        type: string;
                    };
                    sub_heading: {
                        type: string;
                    };
                    meta: {
                        type: string;
                    };
                    backgroundImage: {
                        type: string;
                    };
                    registration_html: {
                        type: string;
                    };
                    registered_html: {
                        type: string;
                    };
                    registered_paid_html: {
                        type: string;
                    };
                    registered_unpaid_html: {
                        type: string;
                    };
                };
            };
        };
    };
};
