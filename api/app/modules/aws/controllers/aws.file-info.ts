import { config } from '@lib/config';
import { insert, query } from '@lib/db';
import { PoolConnection, RowDataPacket } from 'mysql2';


export const saveVideoUploadData = (key: string, filename: string, frmdata: any, db?: PoolConnection) =>
  /* eslint-disable @typescript-eslint/naming-convention */
  insert(
    {
      key,
      short_id: frmdata.short_id || '',
      event_id: frmdata.event_id || '',
      discipline: frmdata.discipline || '',
      rnd: frmdata.rnd || '',
      filename,
      orig_filename: frmdata.filename,
      formdata: ((frmdata) ? (JSON.stringify(frmdata) || '') : ''),
    },
    config.aws.dbTables.videoUploads,
    db
  );


export const getVideoUploadEvent = (shortId: string, eventId: string, db?: PoolConnection) =>
  query<RowDataPacket[]>(
    'SELECT `orig_filename`, `event_id`, `discipline`, `datestamp` FROM ?? WHERE `short_id` = ? AND `event_id` = ?',
    [config.aws.dbTables.videoUploads, shortId, eventId],
    db
  );


export const getKeySdobData = (eTags: string[], db?: PoolConnection) => {
  if (!eTags.length) {
    return Promise.resolve([]);
  }

  let sql = '';
  let sqlWhere = false;
  const values: (string | number)[] = [];

  const eLen = eTags.length;
  for (let e = 0; e < eLen; e++) {
    if (sqlWhere) {
      sql += ' OR ';
    } else {
      sqlWhere = true;
      sql += 'WHERE ';
    }
    sql += '`ETag` = ? ';
    values.push(eTags[e]);
  }

  return query<RowDataPacket[]>(
    'SELECT * FROM ?? ' + sql,
    [config.aws.dbTables.fileInfo, ...values],
    db
  );
};
