import { config } from '@lib/config';
import { first, query, upsert } from '@lib/db';
import { GoogleRequests } from '@lib/google';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

export const createGoogleChannel = (uuid: string, queryData: any, fileId: string, eventId?: number, db?: PoolConnection): Promise<any> => {
  /* eslint-disable @typescript-eslint/naming-convention */
  const dataSet = {
    channel_uuid: uuid,
    querydata: queryData,
    fileId,
    event_id: eventId,
    watching: 1,
  };

  return upsert(dataSet, config.google.dbTables.googleChannels, [], db);
};

export const cancelGoogleChannel = (uuid: string, db?: PoolConnection): Promise<any> =>
  query<ResultSetHeader>(
    'UPDATE ?? SET `watching` = 0 WHERE `channel_uuid` = ?',
  [config.google.dbTables.googleChannels, uuid], db);


export const googleChannelsStopFileWatch = (gReq: GoogleRequests, data: any) =>
  gReq.tokens.token.then(token => {
    const url = '/drive/v3/channels/stop';
    return gReq.postRequest(token, 'www.googleapis.com', url, data);
  });


export const getGoogleChannelByFileId = (fileId: string, db?: PoolConnection): Promise<any> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `file_id` = ? LIMIT 1',
      [config.google.dbTables.googleChannels, fileId],
      db
  ).then((r: RowDataPacket[]): RowDataPacket => first(r));


export const getGoogleChannelByEventId = (eventId: string, db?: PoolConnection): Promise<any> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `event_id` = (SELECT `id` FROM ?? WHERE `slug` = ?) LIMIT 1',
      [config.google.dbTables.googleChannels, config.events.dbTables.event, eventId],
      db
  ).then((r: RowDataPacket[]): RowDataPacket => first(r));
