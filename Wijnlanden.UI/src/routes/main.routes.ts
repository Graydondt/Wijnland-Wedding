import { Routes } from '@angular/router';
import { HomeComponent } from 'src/components/home/home.component';
import { NotFoundComponent } from 'src/components/not-found/not-found.component';
import { ReservationWizardComponent } from 'src/components/reservation-wizard/reservation-wizard.component';
import { WelcomeComponent } from 'src/components/welcome/welcome.component';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { HomeGuard } from 'src/guards/home.guard';
import { LoggedinGuard } from 'src/guards/loggedin.guard';

export const mainRoutes: Routes = [
	{ path: '', redirectTo: 'welcome', pathMatch: 'full' },
	{
		path: 'welcome',
		component: WelcomeComponent,
		canActivate: [ LoggedinGuard ]
	},
	{
		path: 'profile',
		children: [
			{
				path: 'reservation/:code/:step',
				component: ReservationWizardComponent,
				canActivate: [ AuthenticationGuard ]
			},
			{
				path: 'reservation/:code',
				component: ReservationWizardComponent,
				canActivate: [ AuthenticationGuard ]
			}
		]
	},
	{ path: 'home', component: HomeComponent, canActivate: [ AuthenticationGuard, HomeGuard ] },
	{ path: 'not-found', component: NotFoundComponent },
	{ path: '**', redirectTo: 'not-found' }
];
