import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TokenService } from './services/token.service';

@NgModule({
  imports: [
    CommonModule,
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
