import { config } from '@lib/config';
import { first, query } from '@lib/db';
import { UUID } from '@typings/index';
import { ResultsProfile } from '@typings/profile';
import { PoolConnection, RowDataPacket } from 'mysql2';

export const toResultsProfile = (r: RowDataPacket): ResultsProfile =>
  /* eslint-disable @typescript-eslint/naming-convention */
  ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    peopleId: r.people_id,
  });

export const getProfileByUUID = (uuid: UUID, db?: PoolConnection): Promise<ResultsProfile> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `id` = ? LIMIT 1',
      [config.profiles.dbTables.profile, uuid],
      db
  ).
  then(r => first(r)).
  then(r => toResultsProfile(r));


export const getProfileBySlug = (slug: UUID, db?: PoolConnection): Promise<ResultsProfile> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `slug` = ? LIMIT 1',
      [config.profiles.dbTables.profile, slug.toLocaleLowerCase()],
      db
  ).
  then(r => first(r)).
  then(r => toResultsProfile(r));


export const getProfileByKeywords = async (keywords: string, db?: PoolConnection): Promise<ResultsProfile[]> => {
  /*
  SELECT * FROM profile WHERE
  name LIKE '%Ste%' AND
  name LIKE '%Hu%'
  OR people_id = ANY(
      SELECT master_id FROM people_crossed WHERE child_id = ANY(SELECT id FROM uspa_people WHERE name LIKE '%Ste%' AND name LIKE '%Hu%')
  )
  */
  let sql = '';
  const values: (string | number)[] = [];

  // Split String by Spaces
  const arrKeywords = keywords.split(' ').filter(k => k.trim() !== '');
  const arrKi = arrKeywords.length;
  if (arrKi <= 0) {
    return [] as ResultsProfile[];
  }

  sql += 'SELECT * FROM ?? WHERE ';
  values.push(config.profiles.dbTables.profile);

  let sqlPeople = '';
  const sqlValues: (string | number)[] = [];
  sqlPeople += '(';
  for (let i = 0; i < arrKi; i++) {
    if (i > 0) {
      sql += 'AND ';
    }
    sqlPeople += '`name` LIKE ? ';
    sqlValues.push(`%${arrKeywords[i]}%`);
  }
  sqlPeople += ') ';

  sql += sqlPeople;
  values.push(...sqlValues);

  sql += 'OR `people_id` = ANY(' +
           'SELECT `master_id` FROM `people_crossed` WHERE `child_id` = ANY(' +
             'SELECT `id` FROM `uspa_people` WHERE ' + sqlPeople +
          ')) ';
  values.push(...sqlValues);

  sql += 'ORDER BY `slug` ';
  sql += 'LIMIT 100';

  return query<RowDataPacket[]>(sql, values, db).
  then((rA: RowDataPacket[]) => rA.map(
    (r: RowDataPacket) => toResultsProfile(r)
  ));
};


