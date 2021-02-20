import httpCodes from '@inip/http-codes';
import { ReadProfileParams, ResultsProfile } from '@typings/profile';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getProfileBySlug } from '../controllers/profiles';

export const profileGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  const params: ReadProfileParams = request.params as ReadProfileParams || {} as ReadProfileParams,
        profile = params.profile || '';

  const foundProfile: ResultsProfile = await getProfileBySlug(profile).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_PROFILE', _err);
  });

  if (!foundProfile) {
    throw request.generateError(httpCodes.NOT_FOUND, 'PROFILE_NOT_FOUND');
  }

  reply.code(httpCodes.OK);
  return foundProfile;
};

export const profileGetSchema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      /* eslint-disable @typescript-eslint/naming-convention */
      properties: {
        id: { type: 'string' },
        slug: { type: 'string' },
        name: { type: 'string' },
        peopleId: { type: 'string' },
      },
    },
  },
};
