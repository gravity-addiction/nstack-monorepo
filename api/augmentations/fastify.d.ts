import { GoogleTokens } from '@lib/google';
declare module 'fastify' {
    interface FastifyRequest {
        token: any;
        user: any;
        rbac: any;
        gTokens: GoogleTokens;
        firebase: any;
        generateError<T>(statusCode: number, message?: T, thrownError?: Error): void;
    }
}
