import { config } from '@lib/config';
import { beginTransaction, commit, conn, query, rollback, upsert } from '@lib/db';
import { objRemap } from '@lib/objRemap';
import { Event, EventSimple, Registration, ResultsEvent, ResultsEventSimple, ResultsRegistration } from '@typings/event';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

export const processEventsRegistration = async (regList: any, db?: PoolConnection): Promise<any> => {
  if (!regList || !Array.isArray(regList)) {
    return Promise.reject('Not Valid regList Array');
  }

  const poolConn: PoolConnection = db ? db : await new Promise((res) => {
    conn.getConnection((err: NodeJS.ErrnoException, connection: PoolConnection) => {
      if (err) {
        throw err;
      }
      res(connection);
    });
  });

  try {
    await beginTransaction(poolConn);
    await query<ResultSetHeader>('TRUNCATE ??', config.events.dbTables.eventRegistrations, poolConn);

    const rLen = regList.length;
    const hLen = regList[0].length;

    for (let r = 1; r < rLen; r++) {
      const nObj: any = {};
      const nExtra: any = {};
      for (let h = 0; h < hLen; h++) {
        const head = regList[0][h];
        if (head === 'onsite' || head === 'paid') {
          nObj[regList[0][h]] = !!(regList[r][h]) ? 1 : 0;
        } else if (head === 'short_id' || head === 'name' || head === 'email' || head === 'dropzone') {
          nObj[regList[0][h]] = regList[r][h];
        } else {
          nExtra[regList[0][h]] = regList[r][h];
        }
      }
      nObj.disciplines = JSON.stringify(nExtra);
      await upsert(nObj, config.events.dbTables.eventRegistrations, [], db);
    }


    await commit(poolConn);
  } catch (error) {
    await rollback(poolConn);
    throw error;
  } finally {
    poolConn.release();
  }

  return Promise.resolve(true);
};

/* eslint-disable @typescript-eslint/naming-convention */
export const ngRegistration = (r: RowDataPacket | ResultsRegistration): Registration =>
  ({
    event: r.event,
    short_id: r.short_id,
    paid: r.paid,
    team_name: r.team_name,
    amount: r.amount,
  });

/* eslint-disable @typescript-eslint/naming-convention */
export const dbRegistration = (r: RowDataPacket | ResultsRegistration): ResultsRegistration =>
  ({
    event: r.event,
    short_id: r.short_id,
    paid: r.paid,
    team_name: r.team_name,
    amount: r.amount,
  });

export const dbRegistrations = (r: RowDataPacket[]): ResultsRegistration[] => r.map((rA: any) => dbRegistration(rA));
