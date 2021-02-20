/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AutosizeModule } from 'ngx-autosize';

/* Modules */
import { AppCommonModule } from '@modules/app-common/app-common.module';
import { SpinnerComponentModule } from '@modules/app-common/components/index';
import { AuthDirectivesModule } from '@modules/auth/directives/index';
import { NavigationModule } from '@modules/navigation/navigation.module';

/* Components */
import { components } from './components/index';

/* Containers */
import { containers } from './containers/index';

/* Guards */
import { guards } from './guards/index';

/* Services */
import { services } from './services/index';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        AutosizeModule,
        AppCommonModule,
        NavigationModule,
        AuthDirectivesModule.forRoot(),
        SpinnerComponentModule,
    ],
    providers: [...services, ...guards],
    declarations: [...containers, ...components],
    exports: [...containers, ...components],
})
export class BlogModule {}
