/// <reference types="node" />
import { FastifyPluginCallback, FastifyRequest, FastifyReply, preHandlerHookHandler } from 'fastify';
export * from './http';
export * from './tokens';
export declare const bearerProcess: (request: FastifyRequest, reply: FastifyReply) => Promise<any>;
export declare const bearerHook: preHandlerHookHandler;
export declare const bearerPlugin: FastifyPluginCallback;
export declare const bearer: FastifyPluginCallback<Record<never, never>, import("http").Server>;
