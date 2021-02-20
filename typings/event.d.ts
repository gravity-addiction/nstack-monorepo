export * from './event-video';
export * from './event-video-scorecard';
export * from './event-video-queue';
export * from './event-video-judge';
export * from './event-team';
export * from './event-registration';
export * from './event-comp';

export interface ResultsEventSimple {
  active: string;
  slug: string;
  short_id: string;
  heading: string;
  sub_heading: string;
  meta: string;
  background_image: string;
  registration_html: string;
}

export interface EventSimple {
  active: string;
  slug: string;
  short_id: string;
  heading: string;
  sub_heading: string;
  meta: string;
  backgroundImage: string;
  registration_html: string;
}


// DB Result of table event, Complete
export interface ResultsEvent {
  id: number;
  active: number;
  user: number;
  short_id: string;
  slug: string;
  sheet_id: string;
  heading: string;
  sub_heading: string;
  meta: string;
  background_image: string;
  registration_html: string;
  registered_html: string;
  registered_paid_html: string;
  registered_unpaid_html: string;
}

export interface Event {
  id: number;
  active: number;
  user: number;
  short_id: string;
  slug: string;
  sheet_id: string;
  heading: string;
  sub_heading: string;
  meta: string;
  backgroundImage: string;
  registration_html: string;
  registered_html: string;
  registered_paid_html: string;
  registered_unpaid_html: string;
}
