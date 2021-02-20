// https://www.fastify.io/docs/latest/Routes/
import { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';

import { squareupOauthGet } from './routes/squareup-oauth.get';
import { squareupWebhooksPost } from './routes/sqaureup-webhooks.post';

export const squareup: FastifyPluginCallback = async (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
    done: HookHandlerDoneFunction
): Promise<void> => {

  fastify.get('/squareup/oauth', { }, squareupOauthGet);
  fastify.post('/squareup', { }, squareupWebhooksPost);

  done();
};

/*
server_json in portals table
{
  "vendorsTable": "_vendor_portal.vendors",
  "vendorsActiveTable": "_vendor_portal.vendors_active",
  "paymentsTable": "_vendor_portal.squareup",
  "itemsTable": "_vendor_portal.squareup_items"
}

billing_json in portals table
{
  "receiver_one": "",
  "receiver_two": "",
  "receiver_three": "",
  "receiver_four": "",
  "receiver_five": "",
  "acctpayable_email": ""
}
*/
