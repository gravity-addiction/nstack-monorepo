// https://www.fastify.io/docs/latest/Routes/
import { FastifyPluginCallback, FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';

import { recordIdGetSchema, recordsIdGet } from './routes/record-id.get';
import { recordsRecordnoGet } from './routes/record-recordno.get';
import { recordsPersonGet, recordsPersonGetSchema } from './routes/records-person.get';
import { recordsStateGet, recordsStateGetSchema } from './routes/records-state.get';

import { recordsAdminCheckPost } from './routes/records-admin-check.post';
import { recordsAdminRecordnoPut } from './routes/records-admin-recordno.put';

export const records: FastifyPluginCallback = async (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
    done: HookHandlerDoneFunction
): Promise<void> => {

  fastify.get('/id/:id', { schema: recordIdGetSchema }, recordsIdGet);
  fastify.get('/recordno', { }, recordsRecordnoGet);
  fastify.get('/person/:id', { schema: recordsPersonGetSchema }, recordsPersonGet);
  fastify.get('/state/:abbr', { schema: recordsStateGetSchema }, recordsStateGet);

  done();
};

export const recordsAdmin: FastifyPluginCallback = async (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
    done: HookHandlerDoneFunction
): Promise<void> => {

  fastify.put('/:recordno', { }, recordsAdminRecordnoPut);
  fastify.post('/check', { }, recordsAdminCheckPost);

  done();
};
