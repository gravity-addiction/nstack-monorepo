import { FastifyError, FastifyRequest } from 'fastify';

export function generateError(
    this: FastifyRequest,
    statusCode: number,
    message?: string,
    thrownError?: Error
): FastifyError {

  const err: any = new Error();
  err.statusCode = statusCode;
  if (message) {
    err.message = message;
  } else {
    delete err.message;
  }
  delete err.stack;

  // this.log.error(err);
  if (thrownError) {
    this.log.error(thrownError.message);
  }
  return err;
}
