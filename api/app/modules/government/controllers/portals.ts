import { config } from '@lib/config';
import { first, query } from '@lib/db';

import { PoolConnection, RowDataPacket } from 'mysql2';

export const getPortalById = (id: number, db?: PoolConnection): Promise<RowDataPacket> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `id` = ? LIMIT 1',
      [config.government.dbTables.portals, id],
      db
  ).
  then(resp => first(resp));

export const getPortalByIdent = (ident: string, db?: PoolConnection): Promise<RowDataPacket> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `ident` = ? LIMIT 1 ORDER BY `id` DESC',
      [config.government.dbTables.portals, ident],
      db
  ).
  then(resp => first(resp));

export const getPortalByServiceIdent = (service: string, ident: string, db?: PoolConnection): Promise<RowDataPacket> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `id` = ANY(SELECT `portals_id` FROM ?? WHERE `service_name` = ? AND `service_ident` = ?) LIMIT 1',
      [config.government.dbTables.portals, config.government.dbTables.portalServices, service, ident],
      db
  ).
  then(resp => first(resp));
