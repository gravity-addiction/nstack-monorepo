import { FastifyRequest, FastifyReply } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { IncomingMessage, Server, ServerResponse } from 'http';
export declare const retrieveAuthToken: (request: FastifyRequest) => string;
export declare const setAuthToken: (request: FastifyRequest<RouteGenericInterface, Server, IncomingMessage>, reply: FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>, token: string, rememberme?: boolean) => void;
export declare const removeAuthToken: (request: FastifyRequest<RouteGenericInterface, Server, IncomingMessage>, reply: FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>) => void;
export declare const splitBearerToken: (credential: string) => string;
