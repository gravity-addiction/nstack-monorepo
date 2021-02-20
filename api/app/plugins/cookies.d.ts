/// <reference types="node" />
import { FastifyPluginCallback } from 'fastify';
import 'fastify-cookie';
export declare const cookiesPlugin: FastifyPluginCallback;
export declare const cookies: FastifyPluginCallback<Record<never, never>, import("http").Server>;
