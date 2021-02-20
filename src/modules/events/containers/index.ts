import { EventJudgingComponent } from './event-judging/event-judging.component';
import { EventComponent } from './event/event.component';
import { HomeComponent } from './home/home.component';

export const containers = [EventComponent, HomeComponent, EventJudgingComponent];

export * from './event/event.component';
export * from './home/home.component';
export * from './event-judging/event-judging.component';
