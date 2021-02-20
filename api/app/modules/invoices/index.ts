// https://www.fastify.io/docs/latest/Routes/
import { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';

import { invoicesByPayIdGet } from './routes/invoices-pay_id.get';
import { invoicesPayByIdPost } from './routes/invoices-pay_id.post';

export const invoices: FastifyPluginCallback = async (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
    done: HookHandlerDoneFunction
): Promise<void> => {

  fastify.post('/:pay_id/pay', { }, invoicesPayByIdPost);
  fastify.get('/:pay_id', { }, invoicesByPayIdGet);
  done();
};
