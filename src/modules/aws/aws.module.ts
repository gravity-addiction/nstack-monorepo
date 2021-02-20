/* eslint-disable import/order */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/* Modules */
import { AppCommonModule } from '@modules/app-common/app-common.module';
import { ByteconvertPipeModule } from '@modules/app-common/pipes/index';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { DndModule } from 'ngx-drag-drop';

/* Components */
import * as awsComponents from './components';

/* Containers */
import * as awsContainers from './containers';

/* Modal */
import * as awsModals from './modals';

/* Services */
import * as awsServices from './services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppCommonModule,
    NavigationModule,
    ByteconvertPipeModule,
    DndModule,
  ],
  declarations: [...awsContainers.containers, ...awsComponents.components],
  exports: [...awsContainers.containers, ...awsComponents.components],
})
export class AwsModule {
  static forRoot(): ModuleWithProviders<AwsModule> {
    return {
      ngModule: AwsModule,
      providers: [...awsServices.services, ...awsModals.modules],
    };
  }
}
