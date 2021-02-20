import { EventCompLayoutComponent } from './event-comp-layout/event-comp-layout.component';
import { EventScorecardButtonsEndComponent } from './event-scorecard-buttons-end/event-scorecard-buttons-end.component';
import { EventScorecardButtonsStartComponent } from './event-scorecard-buttons-start/event-scorecard-buttons-start.component';
import { EventScorecardTimelineComponent } from './event-scorecard-timeline/event-scorecard-timeline.component';
import { EventScorecardComponent } from './event-scorecard/event-scorecard.component';
import { EventScoresheetComponent } from './event-scoresheet/event-scoresheet.component';
import { EventTeamsListComponent } from './event-teams-list/event-teams-list.component';
import { EventVideosGroupComponent } from './event-videos-group/event-videos-group.component';
import { EventVideosComponent } from './event-videos/event-videos.component';

export const components = [EventTeamsListComponent, EventCompLayoutComponent, EventVideosComponent, EventScorecardComponent,
                           EventScorecardTimelineComponent, EventScorecardButtonsEndComponent, EventScorecardButtonsStartComponent,
                           EventVideosGroupComponent, EventScoresheetComponent];
export const entryComponents = [ EventScorecardTimelineComponent, EventScorecardButtonsEndComponent, EventScorecardButtonsStartComponent ];

export * from './event-scorecard-buttons-end/event-scorecard-buttons-end.component';
export * from './event-scorecard-buttons-start/event-scorecard-buttons-start.component';
export * from './event-scorecard-timeline/event-scorecard-timeline.component';
export * from './event-teams-list/event-teams-list.component';
export * from './event-comp-layout/event-comp-layout.component';
export * from './event-videos/event-videos.component';
export * from './event-scorecard/event-scorecard.component';
export * from './event-videos-group/event-videos-group.component';
export * from './event-scoresheet/event-scoresheet.component';
