import { config } from '@lib/config';
import { first, query } from '@lib/db';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

export const getVideoQueueList = (offset: number, limit: number, db?: PoolConnection) =>
  query<RowDataPacket[]>(
    'SELECT * FROM ?? ORDER BY status DESC, datestamp LIMIT ?, ?',
    [config.videoQueue.dbTables.videoQueue, offset, limit],
    db
  );

export const addVideoQueueSplice = async (
    videoQueueId: number,
    spliceEvent: string,
    spliceTimestamp: string,
    db?: PoolConnection
): Promise<ResultSetHeader> => {
  const videoQueueInfo = await query<RowDataPacket[]>(
    'SELECT spliceArray FROM ?? WHERE id = ?',
    [config.videoQueue.dbTables.videoQueue, videoQueueId],
    db
  ).
  then((r: RowDataPacket[]): RowDataPacket => first(r));

  let arrSplice = [];
  try {
    arrSplice = JSON.parse(videoQueueInfo.spliceArray);
  } catch (e) { }
  const aSI = arrSplice.findIndex((spE: any) => spE.event === spliceEvent);
  if (aSI === -1) {
    arrSplice.push({ event: spliceEvent, time: spliceTimestamp });
  } else {
    arrSplice[aSI].time = spliceTimestamp;
  }

  return query<ResultSetHeader>(
    'UPDATE ?? SET `spliceArray` = ? WHERE `id` = ?',
    [config.videoQueue.dbTables.videoQueue, JSON.stringify(arrSplice), videoQueueId],
    db
  );
};
