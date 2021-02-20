export interface Dictionary<T> {
  [key: string]: T;
}

export type Email = string;
export type UUID = string;
export type URLString = string;
export type DateString = string;
export type HASH = string;
export type ISOLang = string;

export * as SquareupV1 from './squareup-v1';
export * as SquareupV2 from './squareup-v2';