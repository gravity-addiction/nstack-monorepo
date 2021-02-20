import { config } from '@lib/config';
import { query } from '@lib/db';
import { PoolConnection, RowDataPacket } from 'mysql2';

export const initFileSyncSQL = (sql: string, values: (string | number)[], server: string, bucket: string, key: string,
                                      delimiter: string, max: number, startAfter: number): any => {
  sql += 'SELECT * FROM ?? WHERE `Server` = ? AND `Bucket` = ?';
  values.push(...[config.aws.dbTables.fileSync, server, bucket]);
/*
  sql.select('*').
    where('Server', server).
    andWhere('Bucket', bucket);
*/
  return [sql, values];
};


export const lsFolder = (server: string, bucket: string, key: string, delimiter: string,
                         max: number, startAfter: number, db?: PoolConnection) => {
  let sql = '';
  let values: (string | number)[] = [];

  if (key && delimiter) {
    let sql1 = '';
    let values1: (string | number)[] = [];
    [sql1, values1] = initFileSyncSQL(sql1, values1, server, bucket, key, delimiter, max, startAfter);
    sql1 += ' AND `Key` LIKE ? AND `Key` NOT LIKE ? ';
    values1.push(...[key + '%' + delimiter, key + '%' + delimiter + '%' + delimiter]);

    let sql2 = '';
    let values2: (string | number)[] = [];
    [sql2, values2] = initFileSyncSQL(sql2, values2, server, bucket, key, delimiter, max, startAfter);
    sql2 += ' AND `Key` LIKE ? AND `Key` NOT LIKE ? ';
    values2.push(...[key + '%', key + '%' + delimiter + '%']);

    sql = sql1 + ' UNION ALL ' + sql2;
    values.push(...values1, ...values2);

  } else if (key) {
    [sql, values] = initFileSyncSQL(sql, values, server, bucket, key, delimiter, max, startAfter);
    sql += ' AND `Key` LIKE ? ';
    values.push(key + '%');

  } else if (delimiter) {
    [sql, values] = initFileSyncSQL(sql, values, server, bucket, key, delimiter, max, startAfter);
    sql += ' AND `Key` LIKE ? AND `Key` NOT LIKE ? ';
    values.push(...['%' + delimiter, '%' + delimiter + '%' + delimiter]);

  }

  if (max && startAfter) {
    sql += ' LIMIT ?, ?';
    values.push(...[max, startAfter]);
  } else if (max) {
    sql += ' LIMIT ?';
    values.push(max);
  } else if (startAfter) {
    sql += ' OFFSET ?';
    values.push(startAfter);
  }

  return query<RowDataPacket[]>(sql, values, db);

/*
// `Key` like '2018/%/' and `Key` not like '2018/%/%/'
// `Key` like '2018/%' and `Key` not like '2018/%/%'
  let sql: any;
  if (key && delimiter) {
    const sql1 = initFileSyncSQL(source.db.knex(source.fileSyncTable), server, bucket, key, delimiter, max, startAfter);
    sql1.andWhere('Key', 'LIKE', key + '%' + delimiter).
      andWhere('Key', 'NOT LIKE', key + '%' + delimiter + '%' + delimiter);

    sql = sql1.unionAll(function() {
      initFileSyncSQL(this, server, bucket, key, delimiter, max, startAfter);
      this.from(source.fileSyncTable).
           andWhere('Key', 'LIKE', key + '%').
           andWhere('Key', 'NOT LIKE', key + '%' + delimiter + '%');
    });
  } else if (key) {
    sql = initFileSyncSQL(source.db.knex(source.fileSyncTable), server, bucket, key, delimiter, max, startAfter);
    sql.andWhere('Key', 'LIKE', key + '%');

  } else if (delimiter) {
    sql = initFileSyncSQL(source.db.knex(source.fileSyncTable), server, bucket, key, delimiter, max, startAfter);
    sql.andWhere('Key', 'LIKE', '%' + delimiter).
      andWhere('Key', 'NOT LIKE', '%' + delimiter + '%' + delimiter);

  }

  if (max && max !== '0') {
    try {
      const maxI = parseInt(max, 10);
      sql.limit(maxI);
    } catch (e) { }
  }
  if (startAfter) {
    try {
      const startAfterI = parseInt(startAfter, 10);
      sql.offset(startAfterI);
    } catch (e) { }

  }

  return sql.then(res => [null, res]).catch(err => [err]);
  */
};


export const fetchVideoBatch = (fileList: Array<any>, db?: PoolConnection) => {
  let sql = '';
  let sqlWhere = false;
  const values: (string | number)[] = [];

  sql += 'SELECT `ETag`, `competition_name` as comp, `round`, `draw` FROM ?? ';
  values.push(config.aws.dbTables.fileInfo);

  const fLen = fileList.length;
  for (let f = 0; f < fLen; f++) {
    if (sqlWhere) {
      sql += ' OR ';
    } else {
      sqlWhere = true;
      sql += 'WHERE ';
    }
    sql += '`etag` = ? ';
    values.push(fileList[f].ETag);
  }

  return query<RowDataPacket[]>(sql, values, db).then(
    (r: RowDataPacket[]) => {
      const dLen = r.length;
      for (let d = 0; d < dLen; d++) {
        const fI = fileList.findIndex(file => file.ETag === r[d].ETag);
        if (fI < 0) {
          continue;
        }
        fileList[fI] = { ...fileList[fI], ...r[d] };
      }
      return fileList;
    }
  );
};

export const fetchFolderBatchS3 = (server: string, bucket: string, prefixKey: string,
                                  folderList: Array<any>, db?: PoolConnection) => {
  let sql = '';
  let sqlWhere = false;
  const values: (string | number)[] = [];

  if (!folderList.length) {
    return [null, []];
  }
  sql += 'SELECT `ETag`, `competition_name` as comp, `round`, `draw` FROM ?? ';
  values.push(config.aws.dbTables.fileInfo);

  const fLen = folderList.length;
  for (let f = 0; f < fLen; f++) {
    if (sqlWhere) {
      sql += ' OR ';
    } else {
      sqlWhere = true;
      sql += 'WHERE ';
    }
    sql += '(`server` = ? AND `bucket` = ? AND `key` = ?) ';
    values.push(...[server, bucket, folderList[f].Prefix]);
  }

  return query<RowDataPacket[]>(sql, values, db).then(
    (r: RowDataPacket[]) => {
      const dLen = r.length;
      for (let d = 0; d < dLen; d++) {
        const fI = folderList.findIndex(file => file.Prefix === r[d].key);
        if (fI < 0) {
          continue;
        }
        folderList[fI].name = r[d].name;
      }
      return folderList;
    }
  );
};

export const fetchFolderBatchFileSync = (server: string, bucket: string, prefixKey: string,
                                        folderList: Array<any>, db?: PoolConnection) => {
  let sql = '';
  let sqlWhere = false;
  const values: (string | number)[] = [];

  if (!folderList.length) {
    return [null, []];
  }
  sql += 'SELECT `ETag`, `competition_name` as comp, `round`, `draw` FROM ?? ';
  values.push(config.aws.dbTables.fileInfo);

  const fLen = folderList.length;
  for (let f = 0; f < fLen; f++) {
    if (sqlWhere) {
      sql += ' OR ';
    } else {
      sqlWhere = true;
      sql += 'WHERE ';
    }
    sql += '(`server` = ? AND `bucket` = ? AND `key` = ?) ';
    values.push(...[folderList[f].Server, folderList[f].Bucket, folderList[f].Key]);
  }

  return query<RowDataPacket[]>(sql, values, db).then(
    (r: RowDataPacket[]) => {
      const dLen = r.length;
      for (let d = 0; d < dLen; d++) {
        const fI = folderList.findIndex(file => (
          file.Server === r[d].server &&
          file.Bucket === r[d].bucket &&
          file.Key === r[d].key
        ));
        if (fI < 0) {
          continue;
        }
        folderList[fI].name = r[d].name;
      }
      return folderList;
    }
  );
};
