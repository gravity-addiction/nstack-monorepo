/* eslint-disable import/order */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { RecaptchaV2Service } from './recaptcha-v2.service';
import { RecaptchaV3Service } from './recaptcha-v3.service';

@NgModule({
  imports: [CommonModule]
})
export class GRecaptchaModule {
  static forRoot(): ModuleWithProviders<GRecaptchaModule> {
    return {
      ngModule: GRecaptchaModule,
      providers: [
        RecaptchaV3Service,
      ],
    };
  }
}
