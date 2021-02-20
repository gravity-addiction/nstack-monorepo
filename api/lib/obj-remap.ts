export const objRemap = (from: any, keys: string[]): any => {
  const to: any = {};
  keys.map((v: string) => {
    if (from.hasOwnProperty(v) && from[v] !== '') {
      to[v] = from[v];
    }
  });
  return to;
};
