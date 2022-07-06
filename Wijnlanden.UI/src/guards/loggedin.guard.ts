import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Rsvp } from 'src/classes/enums/rsvp';
import { CodeService } from 'src/services/code.service';
import { FeedbackService } from 'src/services/feedback.service';
import { LoggerService } from 'src/services/logger.service';

@Injectable({
	providedIn: 'root'
})
export class LoggedinGuard implements CanActivate {
	constructor(
		private _authService: CodeService,
		private _router: Router,
		private _logger: LoggerService,
		private _feedback: FeedbackService
	) {}
	async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
		const person = await firstValueFrom(this._authService.currentGuest$());
		if (person && person.rsvp === Rsvp.Yes) {
			this._logger.info('Logged in, re-routing to home', 'LoggedinGuard.canActivate');
			this._router.navigate([ 'home' ]);
			return false;
		}

		const code = this._authService.findCodeFromStorage();
		if (code) {
			return await this.handleAuthentication(code);
		}
		return true;
	}

	private async handleAuthentication(code: string): Promise<boolean> {
		try {
			this._feedback.showLoader();
			const person = await this._authService.authenticateWithCode(code);
			if (person) {
				if (person.done && person.rsvp === Rsvp.Yes) {
					this._logger.info('Logged in, re-routing to home', 'LoggedinGuard.canActivate');
					this._router.navigate([ 'home' ]);
					return false;
				}
				this._logger.info('Found guest, need to rsvp still', 'LoggedinGuard.canActivate');
				this._router.navigate([ '/profile', 'reservation', `${person.code}` ]);
			}
			return true;
		} catch (error) {
			this._logger.error('Could not authenticate', 'LoggedinGuard.handleAuthentication', error);
			this._feedback.showError();
		} finally {
			this._feedback.hideLoader();
			return true;
		}
	}
}
