import { FastifyError, FastifyRequest } from 'fastify';
export declare function generateError(this: FastifyRequest, statusCode: number, message?: string, thrownError?: Error): FastifyError;
