import { ISquareupDayOfWeek } from './i-squareup-day-of-week';

export interface ISquareupBusinessHoursPeriods {
  day_of_week: ISquareupDayOfWeek; //The day of week for this time period.
  end_local_time: string; // The end time of a business hours period, specified in local time using partial-time RFC 3339 format.
  start_local_time: string; // The start time of a business hours period, specified in local time using partial-time RFC 3339 format.
}

export interface ISquareupBusinessHours {
  periods?: ISquareupBusinessHoursPeriods; // The card's unique ID, if any.
};





