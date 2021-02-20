// https://www.fastify.io/docs/latest/Routes/
import { FastifyPluginCallback, FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';

import { authenticationGetKeyGet } from './routes/auth-get-key.get';
import { authenticateDelete } from './routes/authenticate.delete';
import { authenticatePost } from './routes/authenticate.post';
import { userIdPasswordPut } from './routes/user_id-password.put';

export const authSecure: FastifyPluginCallback = async (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
    done: HookHandlerDoneFunction
): Promise<void> => {

  fastify.put('/auth/:user_id/password', { }, userIdPasswordPut);
  fastify.get('/auth/getkey', { }, authenticationGetKeyGet);
  done();
};

export const auth: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
): Promise<void> => {

  fastify.delete('/authenticate', { }, authenticateDelete);
  fastify.post('/authenticate', { }, authenticatePost);

  done();
};
