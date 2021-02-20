import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

export const eventIdPaymentPost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const params: any = request.params || {},
        eventId = params.event_id || '',
        body: any = request.body || {};

/*
const source = fetchSource('registration') || false;
  if (!source) { return Promise.resolve(['bad_db_source']); }

  const params = req.params || {},
        event_id = params.event_id || '',
        body = req.body || {},
        nonce = body.nonce || '',
        short_id = body.short_id || '',
        amount = body.amount || 0,
        shippingAddr = body.shipping || '{}',
        shipping = JSON.parse(shippingAddr) || {},
        billingAddr = body.billing || '{}',
        billing = JSON.parse(billingAddr) || {},
        floatAmount = parseFloat(amount) || 0,
        simpleAmount = Math.round(floatAmount * 100),
        capabilityNeeded = 'CREDIT_CARD_PROCESSING';

  if (!nonce) {
    return res.status(400).json([{'detail': 'There was a problem with the square up processing, You have Not been charged.'}]);
  }
  if (!short_id) {
    return res.status(400).json([{'detail': 'There was a problem with the registration, You have Not been charged.'}]);
  }

  listLocations(). // Fetch Capatible locations
  then(l => {
    if (!l || !l.length) { throw {status: 400, errors: [{'detail': `No locations have ${capabilityNeeded} capabilities.`}] }; }
    const capLocation = findLocationCapability(l, capabilityNeeded);
    return Promise.resolve(capLocation);
  }).then(location => { // Setup Charge
    if (!location) { throw {status: 400, errors: [{'detail': `No locations have ${capabilityNeeded} capabilities.`}] }; }
    const token = require('crypto').randomBytes(64).toString('hex');

    const request_body: ISquareupCharge = {
      card_nonce: nonce,
      amount_money: {
        amount: simpleAmount,
        currency: 'USD'
      },
      reference_id: short_id,
      idempotency_key: token
    };

    return charge(location.id, request_body);
  }).then((resp: ISquareupChargeResponse) => { // Charge Response
    if (resp.errors && resp.errors.length) {
      throw {status: 400, errors: resp.errors };
    }

    let transaction: any = resp.transaction || {};
    const tenders = transaction.tenders || [];

    const rows = [];

    // Actual Tender Records
    tenders.map(t => {
      const amount_money = t.amount_money || {},
            card_details = t.card_details || {},
            card_details_card = card_details.card || {}
      ;

      let values = {
        short_id: short_id,
        product: transaction.product || '',
        amount: amount_money.amount || '',
        currency: amount_money.currency || '',

        location_id: t.location_id || '',
        transaction_id: t.transaction_id || '',
        created_at: t.created_at || '',
        note: t.note || '',
        square_tender_id: t.id || '',

        square_tender_type: t.type || '',
        card_status: card_details.status || '',
        card_entry_method: card_details.entry_method || '',
        card_details_brand: card_details_card.card_brand || '',
        card_details_last_4: card_details_card.last_4 || '',
        card_details_fingerprint: card_details_card.fingerprint || '',
      }

      rows.push(
        source.sheets.addRowWithHeaders(sheet_id, 'payments', values)
      );
    });

    Promise.all(rows).then(_data => {
      return source.sheets.getRegistrationQuery(sheet_id, short_id);
    }).then(data => {
      res.status(200).json(data);
    }).catch(err => {
      throw {
        status: 200,
        errors: [
          {
            'detail': 'Your Registration has been Paid for. However we had problems locating your digital registation record.'
          }
        ]
      };
    });
  }).catch(err => {
    res.status(err.status).json(err.errors);
  });
  */

  reply.code(httpCodes.OK);
  return {};
};
