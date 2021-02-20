'use strict';
/*
  'pdf_wysiwyg': {
    'forms': 'dev_dsm.pdf_wysiwyg_forms',
    'versions': 'dev_dsm.pdf_wysiwyg_versions',
    'data': 'dev_dsm.pdf_wysiwyg_data',
    'saveMethod': 'historical', // or 'overwrite',
    'schema': PdfWysiwyg,
    'db': STRICTDEV
  }
*/


export const insertData = (source: any, version: string, data: any): Promise<any> =>
  source.db.knex(source.data).returning('id').
        insert({ version, data: JSON.stringify(data) });

export const updateData = (source: any, id: number, data: any): Promise<any> =>
  source.db.knex(source.data).update({data: JSON.stringify(data)}).where('id', id);

export const getData = (source: any, dataId: string, version?: string): Promise<any> => {
  const k = source.db.knex(source.data).where('id', dataId);
  if (version) {
    k.andWhere('version', version);
  }
  return k;
};

export const getForms = (source: any, form?: string): Promise<any> => {
  const k = source.db.knex(source.forms);
  if (form) {
    k.where('id', form);
  } else {
    k.select('id');
  }
  return k;
};

export const getVersions = (source: any, form: string, version?: string): Promise<any> => {
  const k = source.db.knex(source.versions).where('form', form);
  if (version) {
    k.where('id', version);
  } else {
    k.select('id', 'form');
  }
  return k;
};


export const exportForms = (source: any, body: any, form: string, version: string): Promise<any> => {
  const k = source.db.knex(source.versions).returning('id');
  if (version !== '' && body.data) {
    k.where('form', form).andWhere('id', version).update({data: JSON.stringify(body.data)});
  } else if (version !== '') {
    k.where('form', form).andWhere('id', version).update(null);
  } else if (body.data) {
    k.insert({form, data: JSON.stringify(body.data)});
  } else {
    k.insert({form, data: null});
  }
  return k;
};

export const setActive = (source: any, form: string, version: string): Promise<any> =>
  source.db.knex(source.forms).where('id', form).update('active_version', version);


export const removeVersion = (source: any, form: string, version: string): Promise<any> =>
  source.db.knex(source.data).where('version', version).then((exist: any) => {
    if (!exist[0]) {
      return source.db.knex(source.versions).where('form', form).andWhere('id', version).del();
    } else {
      return exist;
    }
  });

export const deactivateVersion = (source: any, form: string, version: string): Promise<any> =>
  source.db.knex(source.forms).update('active_version', null).where('id', form).andWhere('active_version', version);

export const saveInputData = (source: any, version: string, data: any, dataId: number, saveMethod: string): Promise<any> => {
  if (dataId && saveMethod === 'overwrite') {
    return updateData(source, dataId, data);
  } else {
    return insertData(source, version, data);
  }
};
