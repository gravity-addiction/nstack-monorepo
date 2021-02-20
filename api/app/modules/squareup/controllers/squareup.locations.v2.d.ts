import { SquareupV2 } from '@typings/index';
export declare const getLocations: (sqToken: any) => Promise<any>;
export declare const filterActiveLocations: (locations: SquareupV2.ISquareupLocation[]) => SquareupV2.ISquareupLocation[];
export declare const findLocationCapability: (locations: SquareupV2.ISquareupLocation[], capability: SquareupV2.ISquareupLocationCapability) => SquareupV2.ISquareupLocation | null;
