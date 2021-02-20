import { FastifyInstance } from 'fastify';
export declare const isMatch: (promises: any) => Promise<boolean>;
export declare const isGlob: (str: string) => boolean;
export declare const globToRegex: (str: string) => RegExp;
export declare class RBAC {
    fastify: FastifyInstance;
    roles: any;
    _init: any;
    private _inited;
    constructor(fastify: FastifyInstance, roles: any);
    _parseRoleMap(roles: any): Map<any, any>;
    asyncInit(roles: any): Promise<void>;
    can(role: any, operation: string, params?: any): Promise<any>;
}
