import { createToken, setAuthToken } from '@app/plugins/bearer';
import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getUserById } from '../controllers/users.info';
import { authenticateUser, authenticateUserKey, setUserChangePassword } from '../controllers/users.password';
import { getRole } from '../controllers/users.roles';

export const authenticatePost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const body: any = request.body,
        username = body.username || '',
        password = body.password || '',
        rememberme = !!body.rememberme || false,
        authKey = body.ak || '';

  if ((username === '' || password === '') && (authKey === '')) {
    throw request.generateError(httpCodes.BAD_REQUEST, 'No Username or Password supplied');
  }

  let id = 0;

  if (authKey) {
    id = await authenticateUserKey(authKey).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Unable to get authentication data', _err);
    });
  } else {
    id = await authenticateUser(username, password).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Unable to get authentication data', _err);
    });
  }

  if (!id) { // Auth No Good
    throw request.generateError(httpCodes.UNAUTHORIZED, 'Unable to find user');
  }

  const userInfo: any = await getUserById(id).catch((_err: Error) => {
    throw request.generateError(httpCodes.BAD_REQUEST, 'Cannot get User By Id', _err);
  });
  const userRole = await getRole(userInfo.id).catch((_err: Error) => {
    throw request.generateError(httpCodes.BAD_REQUEST, 'Cannot find user roles', _err);
  });

  // Create JWT Token for Client
  const jwtBody = {
    id: userInfo.id,
    name: userInfo.name,
    sdobn: userInfo.sdobn,
    username: userInfo.username,
    role: (userRole || {} as any).role || '' || config.rbac.defaultUserRole || '',
  };

  // Save Token to Database
  const ip = request.ip,
        userAgent = request.headers['user-agent'];

  // request.log.debug('JWT Body: %O', jwtBody);
  const token: string = await createToken(jwtBody, ip, userAgent).
                              catch((_err: Error) => {
                                throw request.generateError(500, 'Token server broken', _err);
                              });

  // Assign Token to Cookies or as X-JWT Header
  setAuthToken(request, reply, token, rememberme);

  if (userInfo.changepass) {
    await setUserChangePassword(id, false).catch((_err: Error) => { });
    reply.code(httpCodes.OK);
  } else {
    reply.code(httpCodes.OK);
  }
  reply.send(jwtBody);
};
