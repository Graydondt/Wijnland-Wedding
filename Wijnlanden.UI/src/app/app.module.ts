import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SpinnerComponent } from 'src/components/feedback/spinner/spinner.component';
import { SuccessComponent } from 'src/components/feedback/success/success.component';
import { GoogleMapsComponent } from 'src/components/home/google-maps/google-maps.component';
import { ResultsComponent } from 'src/components/home/results/results.component';
import { NotFoundComponent } from 'src/components/not-found/not-found.component';
import { FoodStepComponent } from 'src/components/reservation-wizard/food-step/food-step.component';
import { GuestStepComponent } from 'src/components/reservation-wizard/guest-step/guest-step.component';
import {
    PartnerDetailsComponent
} from 'src/components/reservation-wizard/guest-step/partner-details/partner-details.component';
import { QuizStepComponent } from 'src/components/reservation-wizard/quiz-step/quiz-step.component';
import { ReservationWizardComponent } from 'src/components/reservation-wizard/reservation-wizard.component';
import { VenueDetailsComponent } from 'src/components/venue-details/venue-details.component';
import { WelcomeComponent } from 'src/components/welcome/welcome.component';
import { OffsetTopDirective } from 'src/directives/offset-top.directive';
import { ScrollableDirective } from 'src/directives/scrollable.directive';

import { HomeComponent } from '../components/home/home.component';
import { NavigationBarComponent } from '../components/navigation-bar/navigation-bar.component';
import { MaterialErrorModule } from '../modules/material-error.module';
import { MaterialModule } from '../modules/material.module';
import { AppRoutingModule } from '../routes/app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		NavigationBarComponent,
		NotFoundComponent,
		SuccessComponent,
		SpinnerComponent,
		WelcomeComponent,
		ScrollableDirective,
		OffsetTopDirective,
		GoogleMapsComponent,
		ResultsComponent,
		VenueDetailsComponent,
		ReservationWizardComponent,
		GuestStepComponent,
		QuizStepComponent,
		FoodStepComponent,
		PartnerDetailsComponent
	],
	imports: [
		AppRoutingModule,
		HttpClientModule,
		HttpClientJsonpModule,
		GoogleMapsModule,
		BrowserModule,
		MaterialModule,
		MaterialErrorModule,
		FormsModule,
		BrowserAnimationsModule,
		CommonModule,
		ReactiveFormsModule,
		MatSidenavModule,
		MatToolbarModule,
		FlexLayoutModule,
		NgxChartsModule
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
