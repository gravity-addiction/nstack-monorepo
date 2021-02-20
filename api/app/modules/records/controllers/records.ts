import { config } from '@lib/config';
import { first, query, insert, update } from '@lib/db';
import { ResultsRecordUSPA } from '@typings/records';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

export const toResultsRecordUSPA = (r: RowDataPacket): ResultsRecordUSPA =>
  ({
    id: r.id,
    zone: r.zone,
    state: r.state,
    subclass: r.subclass,
    category: r.category,
    record: r.record,
    performance: r.performance,
    recordno: r.recordno,
    uspaclass: r.uspaclass,
    uspadate: r.uspadate,
    location: r.location,
    holders: r.holders,
    judges: r.judges,
    notes: r.notes,
    status: r.status,
  });

export const getRecordsById = (id: number, db?: PoolConnection): Promise<ResultsRecordUSPA> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `id` = ? LIMIT 1',
      [config.records.dbTables.uspaRecords, id],
      db
  ).
  then(resp => first(resp)).
  then(resp => toResultsRecordUSPA(resp));


export const getRecordsByRecordno = (recordno: string | string[], db?: PoolConnection): Promise<ResultsRecordUSPA[]> => {
  let sql = '';
  const sqlVals = [];
  if (!Array.isArray(recordno)) {
    recordno = [recordno];
  }

  sql += 'SELECT * FROM ?? WHERE ';
  sqlVals.push(config.records.dbTables.uspaRecords);

  const rLen = recordno.length;
  const sqlWhere = [];
  const sqlWhereVals = [];
  for (let r = 0; r < rLen; r++) {
    sqlWhere.push('`recordno` = ?');
    sqlWhereVals.push(recordno[r]);
  }

  return query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE ' + sqlWhere.join(' OR '),
      [config.records.dbTables.uspaRecords].concat(...sqlWhereVals),
      db
  ).
  then(resp => resp.map(r => toResultsRecordUSPA(r)));
};

export const putRecordByRecordno = (recordno: string | string[], data: any, db?: PoolConnection): Promise<ResultSetHeader> =>
  getRecordsByRecordno(recordno, db).then((records: ResultsRecordUSPA[]) => {
    if (!records.length) {
      return insert(data, config.records.dbTables.uspaRecords, db);
    }
    console.log('Upsert', data);
    return update(data, config.records.dbTables.uspaRecords, records[0].id, db);
  });



export const getRecordsByState = (abbr: string, db?: PoolConnection): Promise<ResultsRecordUSPA[]> => {
  let sql = '';
  const values: (string | number)[] = [];

  sql += 'SELECT * FROM ?? WHERE `status` = ? ';
  values.push(...[config.records.dbTables.uspaRecords, 'Current']);

  if (abbr.toLocaleLowerCase() === 'national') {
    sql += 'AND (`zone` = ? OR `zone` = ?) ';
    values.push(...['US National', 'USPA Open National']);
  } else {
    sql += 'AND `zone` = ? AND `state` = ? ';
    values.push(...['State', abbr]);
  }

  sql += 'ORDER BY `performance` DESC';
  return query<RowDataPacket[]>(sql, values, db).
          then(
            (rA: RowDataPacket[]) => rA.map(
              (r: RowDataPacket) => toResultsRecordUSPA(r)
            )
          );
};

export const getRecordsByPerson = (id: number, db?: PoolConnection): Promise<ResultsRecordUSPA[]> =>
  query<any>(
      'CALL ??(?)',
      [config.records.dbSPs.procRecordsByPeople, id],
      db
  ).
  then((resp: [RowDataPacket[], ResultSetHeader]) => (resp[0] || [])).
  then((rA: RowDataPacket[]) => rA.map(
    (r: RowDataPacket) => toResultsRecordUSPA(r)
  ));




