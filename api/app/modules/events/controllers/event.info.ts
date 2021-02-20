import { config } from '@lib/config';
import { first, insert, query, update, upsert } from '@lib/db';
import { objRemap } from '@lib/objRemap';
import { Event, EventSimple, Registration, ResultsEvent, ResultsEventSimple, ResultsRegistration } from '@typings/event';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';


// Schema Conversions
/* eslint-disable @typescript-eslint/naming-convention */
export const ngEventSimple = (r: RowDataPacket | ResultsEvent): EventSimple =>
  ({
    active: r.active,
    slug: r.slug,
    short_id: r.short_id,
    heading: r.heading,
    sub_heading: r.sub_heading,
    meta: r.meta,
    backgroundImage: r.background_image,
    registration_html: r.registration_html,
  });

/* eslint-disable @typescript-eslint/naming-convention */
export const dbEventSimple = (r: RowDataPacket | ResultsEvent): ResultsEventSimple =>
  ({
    active: r.active,
    slug: r.slug,
    short_id: r.short_id,
    heading: r.heading,
    sub_heading: r.sub_heading,
    meta: r.meta,
    background_image: r.background_image,
    registration_html: r.registration_html,
  });

/* eslint-disable @typescript-eslint/naming-convention */
export const ngEvent = (r: RowDataPacket | ResultsEvent): Event =>
  ({
    id: r.id,
    active: r.active,
    user: r.user,
    short_id: r.short_id,
    slug: r.slug,
    sheet_id: r.sheet_id,
    heading: r.heading,
    sub_heading: r.sub_heading,
    meta: r.meta,
    backgroundImage: r.background_image,
    registration_html: r.registration_html,
    registered_html: r.registered_html,
    registered_paid_html: r.registered_paid_html,
    registered_unpaid_html: r.registered_unpaid_html,
  });

/* eslint-disable @typescript-eslint/naming-convention */
export const dbEvent = (r: RowDataPacket | ResultsEvent): ResultsEvent =>
  ({
    id: r.id,
    active: r.active,
    user: r.user,
    short_id: r.short_id,
    slug: r.slug,
    sheet_id: r.sheet_id,
    heading: r.heading,
    sub_heading: r.sub_heading,
    meta: r.meta,
    background_image: r.background_image,
    registration_html: r.registration_html,
    registered_html: r.registered_html,
    registered_paid_html: r.registered_paid_html,
    registered_unpaid_html: r.registered_unpaid_html,
  });

export const getEvents = (db?: PoolConnection): Promise<ResultsEvent[]> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ??',
      [config.events.dbTables.event],
      db
  ).then((rA: RowDataPacket[]) => rA.map((r: RowDataPacket) => dbEvent(r)));

export const getEventById = (id: number, db?: PoolConnection): Promise<ResultsEvent> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `id` = ? LIMIT 1',
      [config.events.dbTables.event, id],
      db
  ).
  then((r: RowDataPacket[]): RowDataPacket => first(r)).
  then((r: RowDataPacket): ResultsEvent => dbEvent(r));

export const getEventByShortId = (shortId: string, db?: PoolConnection): Promise<ResultsEvent> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `short_id` = ? LIMIT 1',
      [config.events.dbTables.event, shortId],
      db
  ).
  then((r: RowDataPacket[]): RowDataPacket => first(r)).
  then((r: RowDataPacket): ResultsEvent => dbEvent(r));

export const getEventBySlug = (slug: string, db?: PoolConnection): Promise<ResultsEvent> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `slug` = ? LIMIT 1',
      [config.events.dbTables.event, slug],
      db
  ).
  then((r: RowDataPacket[]): RowDataPacket => first(r)).
  then((r: RowDataPacket): ResultsEvent => dbEvent(r));

export const getEventIdBySlug = (slug: string, db?: PoolConnection): Promise<number> =>
  query<RowDataPacket[]>(
      'SELECT `id` FROM ?? WHERE `slug` = ? LIMIT 1',
      [config.events.dbTables.event, slug],
      db
  ).
  then((r: RowDataPacket[]): RowDataPacket => first(r)).
  then((r: RowDataPacket): number => parseInt(r.id, 10) || 0);

export const getEventSheetBySlug = (slug: string, db?: PoolConnection): Promise<string> =>
  query<RowDataPacket[]>(
      'SELECT `sheet_id` FROM ?? WHERE `slug` = ? LIMIT 1',
      [config.events.dbTables.event, slug],
      db
  ).
  then((r: RowDataPacket[]): RowDataPacket => first(r)).
  then((r: RowDataPacket): string => r.sheet_id || '');

export const eventsCreate = (body: any, db?: PoolConnection): Promise<ResultsEvent> =>
  insert({
    user: body.user,
    active: body.active || 0,
    sys_event_name: body.event_name || '',
    short_id: body.shortId,
    slug: body.slug,
  }, config.events.dbTables.event, db).
  then((r: ResultSetHeader): Promise<ResultsEvent> => getEventById(r.insertId, db));

export const eventsUpdate = async (body: any, id: number, db?: PoolConnection): Promise<ResultsEvent> => {
  const updateData: any = objRemap(body,
    [
      'user', 'active', 'sys_event_name',
      'short_id', 'slug', 'registration_html',
      'registered_html', 'registered_paid_html','registered_unpaid_html'
    ]
  );

  await update(updateData, config.events.dbTables.event, id, db);
  return getEventById(id);
};

export const deleteEvent = (id: number, db?: PoolConnection): Promise<ResultSetHeader> =>
  query<ResultSetHeader>(
    'DELETE FROM ?? WHERE `id` = ?',
    [config.events.dbTables.event, id],
    db
  );
