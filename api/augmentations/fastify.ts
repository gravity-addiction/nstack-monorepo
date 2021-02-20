import { GoogleTokens } from '@lib/google';
import fastify from 'fastify';

declare module 'fastify' {
  /*
  interface FastifyInstance {

  }
  */
  interface FastifyRequest {
    token: any;
    user: any;
    rbac: any;
    gTokens: GoogleTokens;
    firebase: any;
    generateError<T>(statusCode: number, message?: T, thrownError?: Error): void;
  }
  /*
  interface FastifyReply {

  }
  */
}
