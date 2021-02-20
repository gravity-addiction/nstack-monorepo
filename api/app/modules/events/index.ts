// https://www.fastify.io/docs/latest/Routes/
import { FastifyPluginCallback, FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';

import { eventsGet, eventsGetSchema } from './routes/events.get';
import { eventsPost, eventsPostSchema } from './routes/events.post';
import { eventIdChangedPost } from './routes/event_id-changed.post';
import { eventIdCountsGet } from './routes/event_id-counts.get';
import { eventIdJudgesOfficialPut, eventIdJudgesPrinciplePut } from './routes/event_id-judges.put';
import { eventIdPagesHistoryGet } from './routes/event_id-pages-history.get';
import { eventIdPagesGet } from './routes/event_id-pages.get';
import { eventIdPagesPut } from './routes/event_id-pages.put';
import { eventIdPaymentPost } from './routes/event_id-payment.post';
import { eventIdRegistrationGet, eventIdRegistrationGetSchema } from './routes/event_id-registration.get';
import { eventIdRegistrationPost } from './routes/event_id-registration.post';
import { eventIdRegistrationsGet, eventIdRegistrationsGetSchema } from './routes/event_id-registrations.get';
import { eventIdRequestPostPost } from './routes/event_id-request-post.post';
import { eventIdScoresGet } from './routes/event_id-scores.get';
import { eventIdSetupWatchPost } from './routes/event_id-setup-watch.post';
import { eventIdStopWatchPost } from './routes/event_id-stop-watch.post';
import { eventIdTeamsPost } from './routes/event_id-teams.post';
import { eventIdVideoQueueGet, eventIdVideoQueueNoscoreGet } from './routes/event_id-video-queue.get';
import { eventIdVideoScoreCalcTotalsGet } from './routes/event_id-video-score-calc-totals.get';
import { eventIdVideoScoreSubmitPost } from './routes/event_id-video-score-submit.post';
import { eventIdVideoScoreGet } from './routes/event_id-video-score.get';
import { eventIdVideoScorePut } from './routes/event_id-video-score.put';
import { eventIdWithCompsGet } from './routes/event_id-with-comps.get';
import { eventIdGet, eventIdGetSchema } from './routes/event_id.get';
import { eventIdPut } from './routes/event_id.put';

export const events: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
): Promise<void> => {

  fastify.get('/', { schema: eventsGetSchema }, eventsGet);
  fastify.get('/:event_id', { schema: eventIdGetSchema }, eventIdGet);

  fastify.get('/:event_id/counts.json', { schema: eventIdRegistrationGetSchema }, eventIdCountsGet);
  fastify.get('/:event_id/registrations.json', { schema: eventIdRegistrationsGetSchema }, eventIdRegistrationsGet);
  fastify.get('/:event_id/registration/:short_id', { }, eventIdRegistrationGet);
  fastify.get('/:event_id/video-queue', { }, eventIdVideoQueueGet);
  fastify.get('/:event_id/video-queue/noscore', { }, eventIdVideoQueueNoscoreGet);

  fastify.post('/:event_id/payment.json', { }, eventIdPaymentPost);
  fastify.post('/:event_id/registration', { }, eventIdRegistrationPost);
  fastify.post('/:event_id/request-post', { }, eventIdRequestPostPost);
  fastify.post('/:event_id/setup-watch', { }, eventIdSetupWatchPost);
  fastify.post('/:event_id/stop-watch', { }, eventIdStopWatchPost);
  fastify.post('/:event_id/changed', { }, eventIdChangedPost);

  fastify.get('/:event_id/pages', { }, eventIdPagesGet);
  fastify.get('/:event_id/pages-history', { }, eventIdPagesHistoryGet);
  fastify.put('/:event_id/pages', { }, eventIdPagesPut);

  fastify.get('/:event_id/comps', { }, eventIdWithCompsGet);

  fastify.post('/:event_id/teams', { }, eventIdTeamsPost);

  fastify.put('/:event_id/judges/official', { }, eventIdJudgesOfficialPut);
  fastify.put('/:event_id/judges/principle', { }, eventIdJudgesPrinciplePut);

  fastify.post('/:event_id/scores/submit', { }, eventIdVideoScoreSubmitPost);
  fastify.get('/:event_id/scores', { }, eventIdScoresGet);
  fastify.get('/:event_id/scores/:video_id', { }, eventIdVideoScoreGet);
  fastify.put('/:event_id/scores/:video_id', { }, eventIdVideoScorePut);
  fastify.get('/:event_id/scores/:video_id/calc-totals', { }, eventIdVideoScoreCalcTotalsGet);



  fastify.post('/', { schema: eventsPostSchema }, eventsPost);
  fastify.put('/:id', { }, eventIdPut);

  done();
};
