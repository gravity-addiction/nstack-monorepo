import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutosizeModule } from 'ngx-autosize';

/* Modules */
import { AppCommonModule } from '@modules/app-common/app-common.module';
import { SpinnerComponentModule } from '@modules/app-common/components/index';
import { NavigationModule } from '../navigation/navigation.module';

/* Containers */
import { containers } from './containers/index';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    AutosizeModule,
    AppCommonModule,
    NavigationModule,
    SpinnerComponentModule,
  ],
  declarations: [...containers],
  exports: [...containers],
})
export class HomeModule {
  static forRoot(): ModuleWithProviders<HomeModule> {
    return {
      ngModule: HomeModule,
      providers: [],
    };
  }
}
