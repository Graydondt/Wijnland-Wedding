import { NgModule } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';

import { MaterialErrorStateMatcher } from '../classes/material-error-state-matcher';

@NgModule({
    providers: [
        { provide: ErrorStateMatcher, useClass: MaterialErrorStateMatcher }
    ]
}) export class MaterialErrorModule { }


