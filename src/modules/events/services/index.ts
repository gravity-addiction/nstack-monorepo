import { EventVideoQueueService } from './event-video-queue.service';
import { EventVideoScorecardService } from './event-video-scorecard.service';
import { EventVideoTimesheetService } from './event-video-timesheet.service';
import { EventsVideoService } from './events-video.service';
import { EventsService } from './events.service';
import { RegistrationService } from './registration.service';

export const services = [EventsService, EventsVideoService, EventVideoScorecardService, RegistrationService,
                         EventVideoTimesheetService, EventVideoQueueService];

export * from './events.service';
export * from './event-video-queue.service';
export * from './event-video-scorecard.service';
export * from './event-video-timesheet.service';
export * from './events-video.service';
export * from './registration.service';
