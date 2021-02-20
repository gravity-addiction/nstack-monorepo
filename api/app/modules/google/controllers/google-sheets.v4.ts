import { config } from '@lib/config';
import { GoogleRequests } from '@lib/google';

export const toColumnName = (num: number): string => {
  let ret = '';
  for (let a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
    ret = String.fromCharCode(((num % b) / a) + 65) + ret;
  }
  return ret;
};

export const pick = (_this: any, arr: any[]) => {
  const obj: any = {};
  arr.forEach((key) => {
      obj[key] = _this[key];
  });
  return obj;
};

export const getRegistrationCounts = (gReq: GoogleRequests, sheetId: string) =>
  gReq.getRange(
    sheetId,
    'counts!B1:D',
    'ROWS'
  ).then((data: string) => {
    const resp = JSON.parse(data);
    if (resp.error) {
      return Promise.reject(resp.error);
    }
    return Promise.resolve(resp.values);
  });


export const getRegistrationList = (gReq: GoogleRequests, sheetId: string, eventId: string) => {
  let header: any[] = [];
  const allowedColumns = ['team_name', 'cf_2way_sequential', 'cf_4way_rotation'];
  return gReq.batchGetRange(
    sheetId,
    ['participants!A1:ZZ1']
  ).then((resp: string) => {
    const data = JSON.parse(resp) || {},
          valRanges = data.valueRanges || [],
          valRangesF = valRanges[0] || {},
          valRangeValues = valRangesF.values || [];
    header = valRangeValues[0] || [];

    return gReq.batchGetRange(
        sheetId,
        ['participants!A2:' + toColumnName(header.length + 1) + '1000']
      );
/*
    const headerSelect = [];
    ['team_name', 'paid', 'cf_4way_sequential', 'cf_4way_rotation',
    'cf_2way_sequential','event'].map(h => {
      const hI = header.indexOf(h);
      console.log('Here', hI, h);
      if (hI > -1) {
        headerSelect.push('participants!' + toColumnName(hI + 1) +'2:1000')
      }
    });
console.log('All Select', headerSelect);

    if (headerSelect.length > 0) {

    } else {
      console.log('No Headers Found? Are you Developing? New Sheet??');
      return Promise.resolve({ values: [] });
    }
    */

  }).then(resp => {
    const data = JSON.parse(resp) || {},
          valRanges = data.valueRanges || [],
          valRangesF = valRanges[0] || {},
          valRangeValues = valRangesF.values || [];

    const ret: any[] = [];
    valRangeValues.map((v: any) => {
      const r: any = {};
      header.map((h, i) => {
        if (h === 'paid' && v[i] === 'Yes') {
          r.paid = 'Yes';
        } else if (h === 'paid' && v[i] === 'No') {
          r.paid = 'No';
        } else if (h === 'paid') {
          try {
            const pI = parseFloat(v[i]);
            if (pI > 0) {
              r.paid = 'Yes+';
            } else if (pI < 0) {
              r.paid = 'Almost';
            }
          } catch (e) {
            r.paid = 'Unknown';
          }
        } else if (allowedColumns.indexOf(h) > -1) {
          r[h] = v[i];
        }
      });
      ret.push(r);
    });

    if (resp.error) {
      return Promise.reject(resp.error);
    }
    return Promise.resolve(ret);
  });
};


export const getRegistrationListComplete = (gReq: GoogleRequests, sheetId: string) =>
  gReq.batchGetRange(
    sheetId,
    ['participants!A1:10000']
  ).then(r => JSON.parse(r));


export const getRegistrationQuery = async (gReq: GoogleRequests, sheetId: string, shortId: string): Promise<any> => {
  let header: any[] = [];

  // Find Shortid Column
  const colI: number = await gReq.batchGetRange(
    sheetId, ['participants!1:1']
  ).then((resp: any): number => {
    if (resp.error) {
      console.log(resp.error);
      throw resp.error;
    }

    const dataCol = JSON.parse(resp) || {},
          valRangesCol = dataCol.valueRanges || [],
          valRangesFCol = valRangesCol[0] || {},
          valRangeValuesCol = valRangesFCol.values || [];
    header = valRangeValuesCol[0] || [];

    // console.log('Header', header);

    const shortIdCol = header.indexOf('short_id');
    if (shortIdCol >= 0) {
      return shortIdCol + 1;
    }
    return -1;
  });

  // Short ID Column Not Found
  if (colI === -1) {
    return Promise.reject('NO_SHORT_ID_COLUMN_FOUND');
  }

  const googleBatch = await gReq.batchGetRange(sheetId, ['participants!' + toColumnName(colI) + ':' + toColumnName(colI)]);

  const dataBatch = JSON.parse(googleBatch) || {},
        valRanges = dataBatch.valueRanges || [],
        valRangesF = valRanges[0] || {},
        valRangeValues = valRangesF.values || [];

  const mRange: string[] = ['participants!1:1'];
  valRangeValues.map((m: any, i: number) => {
    const val = m[0] || '';

    // console.log(val, val === shortId);
    if (
      (val && config.caseSensitive && val === shortId) ||
      (val && !config.caseSensitive && val.toUpperCase() === shortId.toUpperCase())
    ) {
      mRange.push('participants!' + (i + 1) + ':' + (i + 1));
    }
  });

  // console.log(mRange);
  // Short_id Row not found, only header
  if (mRange.length === 1) {
    return [];
  }

  const googleRange = await gReq.getRangeList(sheetId, mRange, 'ROWS'),
  dataRange = JSON.parse(googleRange) || {},
  valueRanges: any[] = dataRange.valueRanges || [];

  const values: any = [];
  let headers: any[];

  valueRanges.forEach((data: any) => {
    if (!headers) {
      headers = (data.values || [])[0] || [];
    } else {
      const tVal: any = {};
      if (data.values && data.values.length) {
        data.values.forEach((valEntry: any) => {
          headers.forEach((head: string, headI: number) => {
            const tVar = head.replace(' ', '_').toLowerCase();
            tVal[tVar] = valEntry[headI] || '';
          });
        });
        values.push(tVal);
      }
    }
  });

  return values;
};

/*
      data.valueRanges.shift();
      data.valueRanges.map(r => {
        if (caseSensitive) {
          matched = matched.concat(r.values.filter(d => d[i] === val));
        } else {
          matched = matched.concat(r.values.filter(d => d[i].toUpperCase() === val.toUpperCase()));
        }
      });

      matched.slice(-1).map(m => {
        const r: any = {};
        const hLen = header.length;

        for (let h = 0; h < hLen; h++) {
          const newVar = header[h].replace(' ', '_').toLowerCase();
          r[newVar] = m[h];
        }

        r.paid = (r.paid === 'Yes') ? true : false;
        ret.push( pick(r, ['paid', 'short_id', 'amount', 'first_name', 'last_name']) );
      });
*/

export const addRowWithHeaders = (gReq: GoogleRequests, sheetId: string, sheetTab: string, dataSet: any): Promise<any> =>
  // Object.keys(dataSet).filter(d => (d !== 'short_id' && d !== 'recaptcha')).map(d => values.push(dataSet[d]));

  gReq.batchGetRange(
    sheetId,
    [sheetTab + '!1:1']
  ).then(resp => {
    const data = JSON.parse(resp) || {},
          valRanges = data.valueRanges || [],
          valRangesF = valRanges[0] || {},
          valRangeValues = valRangesF.values || [],
          header = valRangeValues[0] || [],
          newR: string[] = [];

    const values = dataSet.map((dS: any) => {
      const hLen = header.length;
      const rKeys = Object.keys(dS),
            rLen = rKeys.length;

      const tmpValues = [];

      // Loop through known headers, resorting the object to match the google headers
      for (let h = 0; h < hLen; h++) {
        const nVal = dS[header[h]] || '';
        tmpValues[h] = nVal;
      }

      // loop through all object vars and add any new headers
      for (let r = 0; r < rLen; r++) {
        if (header.indexOf(rKeys[r]) > -1) {
          continue;
        }
        const newRI = newR.indexOf(rKeys[r]);
        const headerI = header.length + ((newRI > -1) ? newRI : newR.length);
        if (newRI === -1) {
          newR.push(rKeys[r]);
        }

        tmpValues[headerI] = dS[rKeys[r]];
      }

      // console.log('New Columns', newR);
      // console.log('Values', tmpValues);
      return tmpValues;
    });

    // console.log('Append', values);
    const promiseList = [gReq.appendRow(sheetId, sheetTab + '!A2', { values })];

    if (newR.length) {
      const colRange = sheetTab + '!' +
          toColumnName(header.length + 1) + '1:' +
          toColumnName(header.length + newR.length + 1) + '1';
      // console.log('ColRange', colRange);
      promiseList.push(gReq.setRange(sheetId,
        colRange,
        { values: [ newR ] }
      ));
    }

    return promiseList.reduce((promiseChain, currentTask) =>
      promiseChain.then(chainResults =>
        currentTask.then(currentResult =>
          [ ...chainResults, currentResult ]
        )
      )
    , Promise.resolve([])).then(results =>
      // if (results.length > 1) { console.log('Added Range', results[1]); }
      Promise.resolve(results[0])
    );
  });
