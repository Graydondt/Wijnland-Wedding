import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialErrorModule } from 'src/modules/material-error.module';
import { MaterialModule } from 'src/modules/material.module';

import { FoodStepComponent } from './food-step/food-step.component';
import { PartnerDetailsComponent } from './guest-step/partner-details/partner-details.component';
import { GuestStepComponent } from './guest-step/guest-step.component';
import { QuizStepComponent } from './quiz-step/quiz-stepcomponent';
import { ReservationWizardComponent } from './reservation-wizard.component';

// @NgModule({
// 	declarations: [
// 		ReservationWizardComponent,
// 		GuestStepComponent,
// 		QuizStepComponent,
// 		FoodStepComponent,
// 		PartnerDetailsComponent
// 	],
// 	imports: [
// 		BrowserModule,
// 		MaterialModule,
// 		MaterialErrorModule,
// 		FormsModule,
// 		BrowserAnimationsModule,
// 		CommonModule,
// 		ReactiveFormsModule
// 	]
// })
// export class ReservationWizardModule {}
