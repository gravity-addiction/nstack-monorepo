export const emptyObj = (obj: any) => {
  // eslint-disable-next-line guard-for-in
  for (const _i in obj) {
    return false;
  }
  return true;
};
