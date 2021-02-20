declare module 'shortid32' {
  export interface ShortidDecode {
    version: number;
    worker: number;
  }

  export function generate(): string;
  export function decode(str: string): ShortidDecode;
  export function characters(str: string): string;
  export function isValid(id: string): boolean;
  export function seed(id: number): void;
  export function worker(id: number): void;
}
