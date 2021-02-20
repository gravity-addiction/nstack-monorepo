import { ModuleWithProviders, NgModule } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';

import { TokenService } from './services/token.service';

@NgModule({
  imports: [
    NativeScriptCommonModule,
  ],
})
export class TokenModule {
  static forRoot(): ModuleWithProviders<TokenModule> {
    return {
      ngModule: TokenModule,
      providers: [
        TokenService,
      ],
    };
  }
}
