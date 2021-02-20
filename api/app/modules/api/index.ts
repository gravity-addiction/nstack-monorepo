import { cookies } from '@app/plugins/cookies';
import { generateError } from '@app/plugins/generate-error';
import { noCache } from '@app/plugins/nocache';
import { RBAC } from '@app/plugins/rbac';
import { config } from '@lib/config';
import { GoogleTokens } from '@lib/google/google.tokens';
import { FastifyPluginCallback, FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

export const apiDecoratorsPlugin: FastifyPluginCallback = async (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
    done: HookHandlerDoneFunction
): Promise<void> => {
  // Enable cookie processing
  fastify.register(cookies);
  // No Cache responses
  fastify.register(noCache);

  // (.generateError) generateError wrapper for quick request replies
  fastify.decorateRequest('generateError', { getter: () => generateError });

  // (.rbac) Role Based Access Permissions
  if (config.rbac && config.rbac.enabled) {
    try {
      const rbac = new RBAC(fastify, config.rbac.definition);
      fastify.decorateRequest('rbac', { getter: () => rbac });
    } catch (err) {
      fastify.log.error('RBAC Error', err.message);
    }
  }

  // (.gTokens) Google Tokens
  try {
    const gTokens = new GoogleTokens();
    fastify.decorateRequest('gTokens', { getter: () => gTokens });
  } catch (err) {
    fastify.log.error('Google Tokens Error', err);
  }

  done();
};

export const apiDecorators = fastifyPlugin(apiDecoratorsPlugin);
