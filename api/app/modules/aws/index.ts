// https://www.fastify.io/docs/latest/Routes/
import { FastifyPluginCallback, FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';

import { awsHomeGet } from './routes/aws-home.get';
import { awsHomePost } from './routes/aws-home.post';
import { awsKeySecretGet } from './routes/aws-key-secret.get';
import { awsKeyDelete } from './routes/aws-key.delete';
import { awsKeyGet } from './routes/aws-key.get';
import { awsLsBucketsGet } from './routes/aws-ls-buckets.get';
import { awsLsVideoGet } from './routes/aws-ls-video.get';
import { awsLsGet } from './routes/aws-ls.get';
import { awsRequestCookieGet } from './routes/aws-request-cookie.get';
import { awsRequestPostPost } from './routes/aws-request-post.post';
import { awsRequestUrlGet } from './routes/aws-request-url.get';

export const aws: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
): Promise<void> => {

  // Keys
  fastify.get('/key', { }, awsKeyGet);
  fastify.get('/key-secret', { }, awsKeySecretGet);
  fastify.delete('/key', { }, awsKeyDelete);

  // Ls
  fastify.get('/ls', { }, awsLsGet);
  fastify.get('/ls-video', { }, awsLsVideoGet);
  fastify.get('/ls-buckets', { }, awsLsBucketsGet);

  // Urls
  fastify.get('/request-url', { }, awsRequestUrlGet);
  fastify.get('/request-cookie', { }, awsRequestCookieGet);
  fastify.post('/request-post', { }, awsRequestPostPost);

  // Users
  fastify.get('/home', { }, awsHomeGet);

  // Create Home Folder for User
  fastify.post('/home', { }, awsHomePost);

  done();
};
