import { FastifyInstance } from 'fastify';
export declare class FastifyApp {
    server: FastifyInstance;
    constructor();
    listen(): Promise<unknown>;
}
