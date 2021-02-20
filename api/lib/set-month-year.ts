'use strict';

export const setMonthYear = (qMonth: number | string | null, qYear: number | string | null): Date => {
  const dNow = new Date();
  dNow.setDate(1);

  if (qMonth) {
    const iMonth = parseInt(qMonth.toString(), 10) || null;
    if (iMonth) {
      dNow.setMonth(iMonth - 1);
    }
  }
  if (qYear) {
    const iYear = parseInt(qYear.toString(), 10) || null;
    if (iYear) {
      dNow.setFullYear(iYear);
    }
  }
  return dNow;
};

export const setMonthYearMonthRange = (qMonth: number | string, qYear: number | string): Date[] => {
  const dNow = new Date();
  dNow.setDate(1);
  dNow.setHours(0, 0, 0);
  let dTill = new Date(dNow.getFullYear(), dNow.getMonth(), 0, 23, 59, 59);

  if (qMonth) {
    const iMonth = parseInt(qMonth.toString(), 10) || null;
    if (iMonth) {
      dNow.setMonth(iMonth - 1);
      dTill = new Date(dNow.getFullYear(), iMonth, 0, 23, 59, 59);
    }
  }
  if (qYear) {
    const iYear = parseInt(qYear.toString(), 10) || null;
    if (iYear) {
      dNow.setFullYear(iYear);
      dTill = new Date(iYear, (dNow.getMonth() + 1), 0, 23, 59, 59);
    }
  }
  return [dNow, dTill];
};
