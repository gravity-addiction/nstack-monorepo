'use strict';

export const dateToMysqlUTC = (tDate: Date): string =>
  tDate.getUTCFullYear() + '-' +
    ('00' + (tDate.getUTCMonth() + 1)).slice(-2) + '-' +
    ('00' + tDate.getUTCDate()).slice(-2) + ' ' +
    ('00' + tDate.getUTCHours()).slice(-2) + ':' +
    ('00' + tDate.getUTCMinutes()).slice(-2) + ':' +
    ('00' + tDate.getUTCSeconds()).slice(-2);

export const dateToMysql = (tDate: Date): string =>
  tDate.getFullYear() + '-' +
    ('00' + (tDate.getMonth() + 1)).slice(-2) + '-' +
    ('00' + tDate.getDate()).slice(-2) + ' ' +
    ('00' + tDate.getHours()).slice(-2) + ':' +
    ('00' + tDate.getMinutes()).slice(-2) + ':' +
    ('00' + tDate.getSeconds()).slice(-2);

export const mysqlToDate = (sDate: string): Date =>
  new Date(Date.parse(sDate.replace(/-/g, '/')));
