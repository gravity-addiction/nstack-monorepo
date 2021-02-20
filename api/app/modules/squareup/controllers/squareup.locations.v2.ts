import { SquareupV2 } from '@typings/index';

import { createEndpoint, squareupExecute } from './squareup.api';

export const getLocations = (sqToken: any) =>
  squareupExecute(sqToken, createEndpoint('locations', null, 'v2', sqToken), 'GET');

export const filterActiveLocations = (locations: SquareupV2.ISquareupLocation[]): SquareupV2.ISquareupLocation[] =>
  locations.filter((location: SquareupV2.ISquareupLocation) => (location.status || '').toLocaleUpperCase() === 'ACTIVE');


export const findLocationCapability = (
  locations: SquareupV2.ISquareupLocation[],
  capability: SquareupV2.ISquareupLocationCapability
): SquareupV2.ISquareupLocation | null => {
  // console.log('Find From', locations);
  for (let i = locations.length - 1; i >= 0; i--) {
    if (locations[i].hasOwnProperty('capabilities') && (locations[i].capabilities || []).indexOf(capability) > -1) {
      return locations[i];
    }
  }
  return null;
};
