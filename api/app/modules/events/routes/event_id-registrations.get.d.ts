import { RouteHandlerMethod } from 'fastify';
export declare const eventIdRegistrationsGet: RouteHandlerMethod;
export declare const eventIdRegistrationsGetSchema: {
    params: {
        type: string;
        properties: {
            event_id: {
                type: string;
            };
        };
    };
    response: {
        200: {
            type: string;
            items: {
                type: string;
                properties: {
                    event: {
                        type: string;
                    };
                    short_id: {
                        type: string;
                    };
                    paid: {
                        type: string;
                    };
                    team_name: {
                        type: string;
                    };
                    amount: {
                        type: string;
                    };
                };
            };
        };
    };
};
