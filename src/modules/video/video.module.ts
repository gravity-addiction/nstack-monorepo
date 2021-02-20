/* eslint-disable import/order */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AutosizeModule } from 'ngx-autosize';

/* Modules */
import { AppCommonModule } from '@modules/app-common/app-common.module';
import { AuthDirectivesModule } from '@modules/auth/directives/index';
import { SpinnerComponentModule } from '@modules/app-common/components/spinner/spinner.component';
import { AwsModule } from '@modules/aws/aws.module';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DndModule } from 'ngx-drag-drop';
import { NgxDraggableDomModule } from 'ngx-draggable-dom';

/* Components */
import * as videoComponents from './components/index';

/* Containers */
import * as videoContainers from './containers/index';

/* Directives */
import * as videoDirectives from './directives/index';

/* Modals */
// import * as videoModals from './modals/index';

/* Pipes */
// import * as videoPipes from './pipes/index';

/* Services */
import * as videoServices from './services/index';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    AutosizeModule,
    AppCommonModule,
    NavigationModule,
    AuthDirectivesModule,
    AwsModule,
    SpinnerComponentModule,
    DndModule,
    NgxDraggableDomModule,
    BsDropdownModule,

    ...videoComponents.modules,
    // ...videoModals.modules,
    // ...videoPipes.modules,
  ],
  declarations: [...videoContainers.containers, ...videoComponents.components, ...videoDirectives.directives],
  entryComponents: [...videoComponents.entryComponents],
  exports: [...videoContainers.containers, ...videoComponents.components],
})
export class VideoModule {
  static forRoot(): ModuleWithProviders<VideoModule> {
    return {
      ngModule: VideoModule,
      providers: [...videoServices.services], // , ...videoPipes.pipes],
    };
  }
}



/*

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { VideoControlsComponent } from './video-controls/video-controls.component';
import { VideoFfprobeComponent } from './video-ffprobe/video-ffprobe.component';
import { VideoStatsComponent } from './video-stats/video-stats.component';
import { VideoTimelineComponent } from './video-timeline/video-timeline.component';
import { VideoTimesheetComponent } from './video-timesheet/video-timesheet.component';

import { HeaderDefaultModule } from '../header-default/header-default.module';
import { VideoPlayerPage } from './video-player/video-player.page';
import { VideoPage } from './video.page';

import { AdvertisementModule } from '../advertisements/advertisements.module';
import { CompListingModule } from '../comp-listing/comp-listing.module';
import { DbFileListingModule } from '../db-file-listing/db-file-listing.module';

import { ProfileSidebarModule } from '../profile-sidebar/profile-sidebar.module';
import { S3FileListingModule } from '../s3-file-listing/s3-file-listing.module';
import { AutogrowModule } from '../_directives/autogrow.directive';
import { ClassToScoremarkModule } from '../_pipes/class-to-scoremark.pipe';
import { KeyvalueModule } from '../_pipes/keyvalue.pipe';

import { VideoSettingsSelectModule } from '../_modals/video-settings-select/video-settings-select.module';
import { VideoSettingsModule } from '../_modals/video-settings/video-settings.module';
import { VideoTimesheetEditPointModule } from '../_modals/video-timesheet-edit-point/video-timesheet-edit-point.module';
import { VideoUploadQueueModule } from '../_modals/video-upload-queue/video-upload-queue.module';
import { VideoUploadModule } from '../_modals/video-upload/video-upload.module';
import { VideoFfprobeModule } from './video-ffprobe/video-ffprobe.module';


import { VideoDirectivesModule } from './directives';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,

    AdvertisementModule,
    AutogrowModule,
    ClassToScoremarkModule,
    CompListingModule,
    DbFileListingModule,
    FolderThreadsModule,
    HeaderDefaultModule,
    ProfileSidebarModule,
    S3FileListingModule,

    VideoDirectivesModule,
    VideoFfprobeModule,
    VideoSettingsModule,
    VideoSettingsSelectModule,
    VideoTimesheetEditPointModule,
    VideoUploadModule,
    VideoUploadQueueModule,

    RouterModule.forChild([
      {
        path: '',
        component: VideoPage,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
      {
        path: 'player',
        component: VideoPlayerPage,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
    ]),
  ],
  declarations: [
    VideoControlsComponent,
    VideoStatsComponent,
    VideoTimelineComponent,
    VideoTimesheetComponent,
    VideoPage,
    VideoPlayerPage,
  ],
})
export class VideoModule {}
*/
