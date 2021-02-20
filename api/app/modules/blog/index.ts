// https://www.fastify.io/docs/latest/Routes/
import { FastifyPluginCallback, FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';

import { blogAllGet, blogAllGetSchema } from './routes/blog-all.get';
import { blogDelete, blogDeleteSchema } from './routes/blog.delete';
import { blogGet, blogGetSchema } from './routes/blog.get';
import { blogPost, blogPostSchema } from './routes/blog.post';
import { blogPut, blogPutSchema } from './routes/blog.put';

export const blog: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
): Promise<void> => {

  fastify.post('/', { schema: blogPostSchema }, blogPost);
  fastify.delete('/:id', { schema: blogDeleteSchema }, blogDelete);
  fastify.put('/:id', { schema: blogPutSchema }, blogPut);

  fastify.get('/', { schema: blogAllGetSchema }, blogAllGet);
  fastify.get('/:id', { schema: blogGetSchema }, blogGet);
  done();
};
