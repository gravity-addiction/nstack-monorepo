import { rejects } from 'assert';
import { createPool, FieldPacket, OkPacket, Pool, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

export let conn: Pool;

export const checkAlphaNum = (data: any, key: string): boolean => (typeof data[key] === 'string' || typeof data[key] === 'number');

export const extractSQL = (data: any, key: string): string => `(${data[key].sql || ''})`;

export const createConnection = async (poolConfig: any) => {
/*
  poolConfig = {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    connectionLimit: 10,
    waitForConnections: false,
    queueLimit: 0,
  };
*/
  if (!conn) {
    conn = await createPool(poolConfig);
  }
};

export const connection = (): Promise<PoolConnection> =>
  new Promise((res, rej) => {
    conn.getConnection((err, gotConn) => {
      if (err) {
        rej(err);
      } else {
        res(gotConn);
      }
    });
  });

export const beginTransaction = async (db: PoolConnection): Promise<any> =>
  db.promise().query('START TRANSACTION');

export const commit = async (db: PoolConnection): Promise<any> =>
  db.promise().query('COMMIT');

export const rollback = async (db: PoolConnection): Promise<any> =>
  db.promise().query('ROLLBACK');

export const query = <T extends ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[]>(
    sql: string,
    values: (string | number)[],
    db?: PoolConnection
): Promise<T> =>
  // console.log((db ? db : conn).format(sql, values));
  (db ? db : conn).promise().query(sql, values).then(
    (rows: [ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[], FieldPacket[]]) => (rows[0] as T)
  );

export const first = (rows: RowDataPacket[]): RowDataPacket => {
  if (Array.isArray(rows) && rows.length) {
    return (rows[0] as RowDataPacket);
  } else {
    return ({} as RowDataPacket);
  }
};

export const insert = (data: any, table: string, db?: PoolConnection): Promise<ResultSetHeader> => {
  // Declared and Placeholder columns that can be injected into query
  const arrFields = Object.keys(data),
        columnsStr = arrFields.map(_key => '??').join(','),
        insertPlaceholdersStr = arrFields.map(_key => checkAlphaNum(data, _key) ? '?' : extractSQL(data, _key)).join(','),
        sql = (`INSERT INTO ?? (${columnsStr}) VALUES (${insertPlaceholdersStr});`).replace(/\n/gm, ''),
        values = arrFields.map(key => key).concat(
          arrFields.filter(key => checkAlphaNum(data, key)).map(key => data[key])
        );

  // Add table to beginning of array
  values.unshift(table);

  // Execute query using passed params
  return (db ? db : conn).promise().query(sql, values).then(
    (rows: [ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[], FieldPacket[]]) => (rows[0] as ResultSetHeader)
  );
};

export const update = (data: any, table: string, id: number, db?: PoolConnection): Promise<ResultSetHeader> => {
  // Declared and Placeholder columns that can be injected into query
  const arrFields = Object.keys(data),
        updatePlaceholderStr  = arrFields.map(_key => checkAlphaNum(data, _key) ? `?? = ?` : `?? = ${extractSQL(data, _key)}`).join(','),
        sql = (`UPDATE ?? SET ${updatePlaceholderStr} WHERE id = ?;`).replace(/\n/gm, ''),
        values = arrFields.map(key => checkAlphaNum(data, key) ? [key, data[key]] : [key]).reduce((a, b) => a.concat(b));

  // Add table to beginning of array
  values.unshift(table);
  // Add where key id to end
  values.push(id);

  // Execute query using passed params
  return (db ? db : conn).promise().query(sql, values).then(
    (rows: [ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[], FieldPacket[]]) => (rows[0] as ResultSetHeader)
  );
};

export const upsert = (data: any, table: string, onDupDropFields: string[] = [], db?: PoolConnection): Promise<ResultSetHeader> => {
  // Declared and Placeholder columns that can be injected into query
  const arrFields = Object.keys(data),
        columnsStr = arrFields.join(','),
        insertPlaceholdersStr = arrFields.map(_key => checkAlphaNum(data, _key) ? '?' : extractSQL(data, _key)).join(','),
        updatePlaceholderStr  = arrFields.filter(_key =>
          (onDupDropFields.indexOf(_key) === -1)
        ).map(_key => checkAlphaNum(data, _key) ? `?? = ?` : `?? = ${extractSQL(data, _key)}`).join(','),

        reducedFields = arrFields.filter(key => checkAlphaNum(data, key)) || [],
        values = reducedFields.map(key => data[key]).  // Add insert field data
            concat(  // Add on duplicate field data
              arrFields.filter(_key => (onDupDropFields.indexOf(_key) === -1)). // Filter out onDupDropFields
              map(key => checkAlphaNum(data, key) ? [key, data[key]] : [key]). // Build Array of Arrays of key or key, data
              reduce((a, b) => a.concat(b)) // Reduce array of arrays to single srray
            );

  // Add table to beginning of array
  values.unshift(table);

  const sql =
      (`INSERT INTO ?? (${columnsStr})
      values (${insertPlaceholdersStr})
      ON DUPLICATE KEY UPDATE ${updatePlaceholderStr};`).replace(/\n/gm, '');

  // console.log((db ? db : conn).format(sql, values));

  // Execute query using passed params
  return (db ? db : conn).promise().query(sql, values).then(
    (rows: [ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[], FieldPacket[]]) => (rows[0] as ResultSetHeader)
  );
};
