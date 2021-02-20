import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getPortalByServiceIdent } from '@app/modules/government/controllers/government';

import { checkWebhookAuth, getWebhookPortalIdent } from '../controllers/squareup.webhooks.common';
import { processWebhook } from '../controllers/squareup.webhooks.v1';

export const squareupWebhooksPost: RouteHandlerMethod = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {

  const body: any = request.body || {},
    secret = request.headers['x-square-signature'] as string || '',
    query: any = request.query || {},
    sandbox: boolean = (query.hasOwnProperty('sandbox') ? true : false) || false;

  // Check Authenticity of this webhook
  if (!checkWebhookAuth(body, secret, sandbox)) {
    reply.status(httpCodes.UNAUTHORIZED);
    request.log.info('POST Auth Check Failed', secret, JSON.stringify(body));
    return '';
  }
  reply.status(httpCodes.NO_CONTENT).send();

  // Get Portals Ident information
  const portalIdent = getWebhookPortalIdent(body);
  if (!portalIdent.ident) {
    request.log.info('No Portal Identifier', portalIdent, JSON.stringify(body));
    // Maybe dump into a graveyard database just in case? Just pull them up to date manually?
    return;
  }

  // Get Portal Information from parsed ident information
  const portalInfo: any = await getPortalByServiceIdent(portalIdent.service, portalIdent.ident).catch((err: any) => {
    request.log.info('No Portal Information in Database', portalIdent, JSON.stringify(body));
    request.log.debug(err);
    return;
  });

  request.log.trace(portalInfo.ident, portalInfo.name);

  // Double check db_name or fail
  if (!portalInfo || !portalInfo.hasOwnProperty('db_name') || portalInfo.db_name === null) {
    request.log.info('No database specified for service ident:', portalIdent, portalInfo, JSON.stringify(body));
    return;
  }

  // Process webhook through controllers
  const paymentData = await processWebhook(body, portalInfo.db_name).catch((err: any) => {
    request.log.info('Problem Processing Webhook', portalIdent, portalInfo, JSON.stringify(body));
    request.log.debug(err);
    return;
  });

  console.log('Payment Data', paymentData);
  /* Send Firebase Messages, need to readd fcm module
  if (!request.firebase) {
    request.log.info('Skipping Firebase!');
    request.log.debug('Firebase Decorator not registered');
    request.log.debug('fastify.register(firebaseDecorator);');
  }

  // Add Alerts On Insert, detect insert by insertId > 0
  if (request.firebase && (paymentData.upsert || {}).insertId > 0) {
    const itemList = paymentData.itemizations || [];
    const iLen = itemList.length;
    const msgList = [];

    // Parse Payment Information
    const payDate = (paymentData.created_at) ? new Date(paymentData.created_at) : new Date() || new Date(),
      payMon = payDate.getMonth() + 1,
      payYr = payDate.getFullYear();

    // Loop Each Item
    for (let i = 0; i < iLen; i++) {
      const vendorId = itemList[i].name || '',
        qty = parseInt(itemList[i].quantity, 10) || 1,
        notes = itemList[i].notes || '';

      // Update Node, modify with qty !== 1
      let msgNote = notes;
      if (qty !== 1) {
        msgNote = `${qty} @ ${msgNote}`;
      }

      // Find existing message to same vendor
      const msgIndex = msgList.findIndex((msg: any) => msg.vendorId === vendorId);
      if (msgIndex !== -1) {
        // Attach to existing message
        msgList[msgIndex].notes.push(msgNote);
      } else {
        // create new message instance with token and title info
        const fcmInfo = await getFCMTokensByVendorId(vendorId, portalInfo.db_name, payMon, payYr).catch((err: any) => {
          request.log.info('Problem Fetching FCM Tokens', portalIdent, portalInfo);
          request.log.info(vendorId, payMon, payYr);
          request.log.debug(JSON.stringify(itemList[i]));
          request.log.debug(err);
          return;
        });
        msgList.push({vendorId, fcmInfo, title: `#${vendorId} ${portalInfo.name} `, notes: [msgNote]});
      }
    } // End for Loop Each Item

    console.log('MsgList', JSON.stringify(msgList));
    // Compile Push Notifications from msgList
    const messages = [];
    const msgListLen = msgList.length || 0;
    // Loop Messages

    for (let mL = 0; mL < msgListLen; mL++) {
      // Each Token in fcmInfo
      const tokens = msgList[mL].fcmInfo || [];
      messages.push(
        ...fcmCompileMessage(msgList[mL].title, msgList[mL].notes.join('\n'), tokens)
      );
    }

    console.log(messages);

    const respMessages = await fcmSendAll(request.firebase.messaging(), messages).
      catch((err: any) => {
        console.log('Send Error!', err);
        return [];
      });
    console.log('Send Resp', respMessages);
    const mRLen = respMessages.length;
    for (let m = 0; m < mRLen; m++) {
      const rMsg = respMessages[m] || {};
      const mToken = rMsg.token || '';
      const mResp = rMsg.response || {};

      if (!mResp.success) { // Issue with request, take closer look
        const mErr = mResp.error || {};
        console.log('Got Error', mResp.error);

        if ((mErr.code === 'messaging/registration-token-not-registered') ||
          (mErr.code === 'messaging/invalid-argument' && mErr.message === 'The registration token is not a valid FCM registration token')
        ) {
          // Deactivate FCM Token
          console.log('Deactive', mToken);
        }
      }

  }
  */
};
