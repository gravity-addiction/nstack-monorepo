import { ISquareupError } from '../../i-squareup-error';
import { ISquareupRefund } from '../../i-squareup-refund';

export interface ISquareupCreateRefundResponse {
  errors?: ISquareupError[]; // Any errors that occurred during the request.
  refund?: ISquareupRefund; // The created refund.
}
