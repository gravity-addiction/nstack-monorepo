/* eslint-disable @typescript-eslint/no-use-before-define */
// https://github.com/TehShrike/is-mergeable-object
export const isMergeableObject = (value: any) => isNonNullObject(value) && !isSpecial(value);

export const isNonNullObject = (value: any) => !!value && typeof value === 'object';

export const isSpecial = (value: any) => {
  const stringValue = Object.prototype.toString.call(value);

  return stringValue === '[object RegExp]' || stringValue === '[object Date]';
};

// https://github.com/TehShrike/deepmerge
export const emptyTarget = (val: any) => Array.isArray(val) ? [] : {};

export const cloneUnlessOtherwiseSpecified = (value: any, options: any): any =>
  (options.clone !== false && options.isMergeableObject(value))
    ? deepmerge(emptyTarget(value), value, options)
    : value;

export const defaultArrayMerge = (target: any, source: any, options: any): any =>
  target.concat(source).map((element: any) => cloneUnlessOtherwiseSpecified(element, options));

export const getMergeFunction = (key: any, options: any): any =>  {
  if (!options.customMerge) {
    return deepmerge;
  }
  const customMerge = options.customMerge(key);
  return typeof customMerge === 'function' ? customMerge : deepmerge;
};

export const getEnumerableOwnPropertySymbols = (target: any): any =>
  Object.getOwnPropertySymbols
    ? Object.getOwnPropertySymbols(target).filter((symbol) =>
      target.propertyIsEnumerable(symbol))
    : [];

export const getKeys = (target: any) => Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));

export const propertyIsOnObject = (object: any, property: any): any =>  {
  try {
    return property in object;
  } catch (_) {
    return false;
  }
};

// Protects from prototype poisoning and unexpected merging up the prototype chain.
export const propertyIsUnsafe = (target: any, key: any) =>
  propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
    && !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
      && Object.propertyIsEnumerable.call(target, key)); // and also unsafe if they're nonenumerable.


export const mergeObject = (target: any, source: any, options: any): any =>  {
  const destination: any = {};
  if (options.isMergeableObject(target)) {
    getKeys(target).forEach((key) => {
      destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    });
  }
  getKeys(source).forEach((key) => {
    if (propertyIsUnsafe(target, key)) {
      return;
    }

    if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
      destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
    } else {
      destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    }
  });
  return destination;
};

export const deepmerge = (target: any, source: any, options: any = {}): any => {
  options.arrayMerge = options.arrayMerge || defaultArrayMerge;
  options.isMergeableObject = options.isMergeableObject || isMergeableObject;
  // cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
  // implementations can use it. The caller may not replace it.
  options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);
  const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source, options);
  } else if (sourceIsArray) {
    return options.arrayMerge(target, source, options);
  } else {
    return mergeObject(target, source, options);
  }
};

export const deepmergeAll = (array: any, options: any = {}) => {
  if (!Array.isArray(array)) {
    throw new Error('first argument should be an array');
  }

  return array.reduce((prev: any, next: any) => deepmerge(prev, next, options), {});
};
