import { ISquareupError } from '../../i-squareup-error';
import { ISquareupLocation } from '../../i-squareup-location';

export interface ISquareupListLocationsResponse {
  errors?: ISquareupError[];
  locations?: ISquareupLocation[];
}
