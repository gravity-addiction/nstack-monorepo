'use strict';

export const dateMath = (d: any): number => {
  if (!d) {
    return 0;
  }
  const _d = new Date(d);
  return (_d.getFullYear() * 10000) + ((_d.getMonth() + 1) * 100) + (_d.getDate());
};

export const dateTimeMath = (d: any): number => {
  if (!d) {
    return 0;
  }
  const _d = new Date(d);
  return (_d.getFullYear() * 100000000) + ((_d.getMonth() + 1) * 1000000) + (_d.getDate() * 10000) +
         (_d.getHours() * 100) + (_d.getMinutes());
};
