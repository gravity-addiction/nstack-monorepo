import { ISquareupError } from '../../i-squareup-error';
import { ISquareupSortOrder } from '../../i-squareup-sort-order';
import { ISquareupTransaction } from '../../i-squareup-transaction';

export interface ISquareupVoidTransaction {
  location_id: string;
  begin_time?: string;
  end_time?: string;
  sort_order?: ISquareupSortOrder;
  cursor?: string;
}

export interface ISquareupVoidTransactionResponse {
  errors?: ISquareupError[];
  transaction?: ISquareupTransaction;
  cursor?: string;
}
