import { ISquareupTender } from './i-squareup-tender';
import { ISquareupRefund } from './i-squareup-refund';
import { ISquareupOrder } from './i-squareup-order';
import { ISquareupAddress } from './i-squareup-address';

export interface ISquareupTransaction {
  id?: string; // The transaction's unique ID, issued by Square payments servers.
  location_id?: string; // The ID of the transaction's associated location.
  created_at?: string; // The time when the transaction was created, in RFC 3339 format.
  tenders?: ISquareupTender[]; // The tenders used to pay in the transaction.
  refunds?: ISquareupRefund[]; // Refunds that have been applied to any tender in the transaction.
  reference_id?: string; // If the transaction was created with the Charge endpoint, this value is the same as the value provided for the reference_id parameter in the request to that endpoint. Otherwise, it is not set.
  product?: string; // The Square product that processed the transaction.
  client_id?: string; // If the transaction was created in the Square Register app, this value is the ID generated for the transaction by Square Register.
                     // This ID has no relationship to the transaction's canonical id, which is generated by Square's backend servers. This value is generated for bookkeeping purposes, in case the transaction cannot immediately be completed (for example, if the transaction is processed in offline mode).
                     // It is not currently possible with the Connect API to perform a transaction lookup by this value.
  order?: ISquareupOrder; // The order associated with this transaction, if any.
  shipping_address?: ISquareupAddress; // The shipping address provided in the request, if any.
}

export enum ISquareupTransactionProduct {
  REGISTER, // Square Register.
  EXTERNAL_API, // The Square Connect API.
  BILLING, // A Square subscription for one of multiple products.
  APPOINTMENTS, // Square Appointments.
  INVOICES, // Square Invoices.
  ONLINE_STORE, // Square Online Store.
  PAYROLL, // Square Payroll.
  OTHER // A Square product that does not match any other value.
}
