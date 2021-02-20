import { config } from '@lib/config';
import { first, insert, query, update } from '@lib/db';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

export const getBlogAll = (db?: PoolConnection): Promise<RowDataPacket[]> =>
  query<RowDataPacket[]>(
    'SELECT * FROM ?? ORDER BY `createdAt` DESC',
    [config.blog.dbTables.post],
    db
  );


export const getBlogById = (id: number, db?: PoolConnection): Promise<RowDataPacket> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `id` = ? LIMIT 1',
      [config.blog.dbTables.post, id],
      db
  ).
  then(resp => first(resp));


export const getBlogBySlug = (slug: string, db?: PoolConnection): Promise<RowDataPacket> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `slug` = ? LIMIT 1',
      [config.blog.dbTables.post, slug],
      db
  ).
  then(resp => first(resp));


export const createPost = async (body: any, db?: PoolConnection): Promise<RowDataPacket> => {
  if (!body.password) {
    body.password = Math.floor(Math.random() * 1000000).toString();
    while (body.password.length < 8) {
      body.password = body.password + '0';
    }
  }

  const insertData: any = {
    slug: body.slug,
    backgroundImage: body.backgroundImage
        ? `url("${body.backgroundImage}")`
        : '',
    heading: body.heading || '',
    subHeading: body.subHeading || '',
    meta: body.meta || '',
    body: body.body || '',
  };

  const postInfo = await insert(insertData, config.blog.dbTables.post, db);
  return getBlogById(postInfo.insertId, db);
};

export const updatePost = async (body: any, id: number, db?: PoolConnection): Promise<RowDataPacket> => {
  const updateData: any = {};

  if (body.hasOwnProperty('backgroundImage')) {
    updateData.backgroundImage = body.backgroundImage ? `url("${body.backgroundImage}")` : '';
  }
  if (body.hasOwnProperty('heading') && body.heading !== '') {
    updateData.heading = body.heading;
  }
  if (body.hasOwnProperty('subHeading') && body.subHeading !== '') {
    updateData.subHeading = body.subHeading;
  }
  if (body.hasOwnProperty('meta') && body.meta !== '') {
    updateData.meta = body.meta;
  }
  if (body.hasOwnProperty('body') && body.body !== '') {
    updateData.body = body.body;
  }
  if (body.hasOwnProperty('slug') && body.slug !== '') {
    updateData.slug = body.slug;
  }

  await update(updateData, config.blog.dbTables.post, id, db);
  return getBlogById(id);
};

export const deletePost = (id: number, db?: PoolConnection): Promise<ResultSetHeader> =>
  query<ResultSetHeader>(
    'DELETE FROM ?? WHERE `id` = ?',
    [config.blog.dbTables.post, id],
    db
  );
