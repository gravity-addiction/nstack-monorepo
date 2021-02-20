import { ISquareupAddress } from './i-squareup-address';
import { ISquareupBusinessHours } from './i-squareup-business-hours';
import { ISquareupCoordinates } from './i-squareup-coordinates';

export interface ISquareupLocation {
  id: string; // Read only The Square-issued ID of the location.
  name: string; // The name of the location. This information appears in the dashboard as the nickname.

  address: ISquareupAddress; // The physical address of the location.
  timezone: string; // The IANA Timezone identifier for the timezone of the location.
  capabilities: ISquareupLocationCapability[]; // Read only The Square features that are enabled for the location.
  status: ISquareupLocationStatus; // The status of the location, either active or inactive.
  created_at: string; // Read only The time when the location was created, in RFC 3339 format.
  merchant_id: string; // Read only The ID of the merchant that owns the location.
  country: string; // Read only The country of the location, in ISO 3166-1-alpha-2 format.
  language_code: string; // The language associated with the location, in BCP 47 format.
  currency: string; // Read only The currency used for all transactions at this location, in ISO 4217 format.
  phone_number: string; // The phone number of the location in human readable format.
  business_name: string; // The business name of the location This is the name visible to the customers of the location. For example, this name appears on customer receipts.
  type: ISquareupLocationType; // The type of the location, either physical or mobile.
  website_url: string; // The website URL of the location.
  business_hours: ISquareupBusinessHours; // Represents the hours of operation for the location.
  business_email: string; // The email of the location. This email is visible to the customers of the location. For example, the email appears on customer receipts.
  description: string; // The description of the location.
  twitter_username: string; // The Twitter username of the location without the '@' symbol.
  instagram_username: string; // The Instagram username of the location without the '@' symbol.
  facebook_url: string; // The Facebook profile URL of the location. The URL should begin with 'facebook.com/'.
  coordinates: ISquareupCoordinates; // The physical coordinates (latitude and longitude) of the location.
  logo_url: string; // Read only The URL of the logo image for the location. The Seller must choose this logo in the Seller dashboard (Receipts section) for the logo to appear on transactions (such as receipts, invoices) that Square generates on behalf of the Seller. This image should have an aspect ratio close to 1:1 and is recommended to be at least 200x200 pixels.
  pos_background_url: string; // Read only The URL of the Point of Sale background image for the location.
  mcc: string; // BETA - The merchant category code (MCC) of the location, as standardized by ISO 18245. The MCC describes the kind of goods or services sold at the location.
  full_format_logo_url: string; // Read only The URL of a full-format logo image for the location. The Seller must choose this logo in the Seller dashboard (Receipts section) for the logo to appear on transactions (such as receipts, invoices) that Square generates on behalf of the Seller. This image can have an aspect ratio of 2:1 or greater and is recommended to be at least 1280x648 pixels.
}

export type ISquareupLocationCapability =
  "CREDIT_CARD_PROCESSING"
;

export type ISquareupLocationStatus = 
  "INACTIVE" |
  "ACTIVE"
;

export type ISquareupLocationType =
  "PHYSICAL" |
  "MOBILE"
;
