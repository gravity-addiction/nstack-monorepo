// https://www.fastify.io/docs/latest/Routes/
import { FastifyPluginCallback, FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';

import { usersGet } from './routes/users.get';
import { usersPost } from './routes/users.post';
// import { userIdPasswordPut } from './routes/user_id-password.put';
import { userIdResetpasswordGet } from './routes/user_id-resetpassword.get';
import { userIdRolesGet } from './routes/user_id-roles.get';
import { userIdDelete } from './routes/user_id.delete';
import { userIdGet } from './routes/user_id.get';
import { userIdPut } from './routes/user_id.put';

export const users: FastifyPluginCallback = async (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
    done: HookHandlerDoneFunction
): Promise<void> => {

  fastify.get('/:user_id/resetpassword', { }, userIdResetpasswordGet);
//   fastify.put('/:user_id/password', { }, userIdPasswordPut);

  fastify.get('/:user_id/roles', { }, userIdRolesGet);

  fastify.get('/:user_id', { }, userIdGet);
  fastify.put('/:user_id', { }, userIdPut);
  fastify.delete('/:user_id', { }, userIdDelete);

  fastify.get('/', { }, usersGet);
  fastify.post('/', { }, usersPost);
  done();
};
