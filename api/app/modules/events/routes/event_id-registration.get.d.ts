import { RouteHandlerMethod } from 'fastify';
export declare const eventIdRegistrationGet: RouteHandlerMethod;
export declare const eventIdRegistrationGetSchema: {
    params: {
        type: string;
        properties: {
            event_id: {
                type: string;
            };
            short_id: {
                type: string;
            };
        };
    };
    response: {
        200: {
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
