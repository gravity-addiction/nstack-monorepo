import httpCodes from '@inip/http-codes';
import { ResultsProfile, ResultsProfileSearch, SearchProfileQuery } from '@typings/profile';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getProfileByKeywords } from '../controllers/profiles';

export const profileSearchGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<ResultsProfileSearch> => {
  const query: SearchProfileQuery = request.query as SearchProfileQuery || {} as SearchProfileQuery,
        keywords = query.keywords || '';

  const foundProfiles: ResultsProfile[] = await getProfileByKeywords(keywords).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_PROFILE', _err);
  });

  if (!foundProfiles) {
    throw request.generateError(httpCodes.NOT_FOUND, 'PROFILE_NOT_FOUND');
  }

  reply.code(httpCodes.OK);
  return {
    keywords,
    results: foundProfiles,
  } as ResultsProfileSearch;
};

/* eslint-disable @typescript-eslint/naming-convention */
export const profileSearchGetSchema = {
  params: {
    type: 'object',
    properties: {
      keywords: {
        type: 'string',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        keywords: { type: 'string' },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              peopleId: { type: 'number' },
              slug: { type: 'string' },
              name: { type: 'string' },
            },
          },
        },
      },
    },
  },
};
