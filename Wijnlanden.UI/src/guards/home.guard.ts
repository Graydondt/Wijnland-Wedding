import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { Rsvp } from 'src/classes/enums/rsvp';
import { CodeService } from 'src/services/code.service';
import { LoggerService } from 'src/services/logger.service';

@Injectable({
	providedIn: 'root'
})
export class HomeGuard implements CanActivate {
	constructor(private _router: Router, private _authService: CodeService, private _logger: LoggerService) {}

	async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
		let person = await firstValueFrom(this._authService.currentGuest$());
		if (person && person.rsvp === Rsvp.Yes) {
			this._logger.info('Authenticated', 'HomeGuard');
			return true;
		}
		const code = route.params['code'];
		if (code) {
			person = await this._authService.authenticateWithCode(code);
			if (person && person.rsvp === Rsvp.Yes) {
				this._logger.info('Authenticated', 'AuthenticationGuard');
				return true;
			}
		}

		this._logger.warn('Not Authenticated, navigating to Welcome page', 'AuthenticationGuard');
		this._router.navigateByUrl('/welcome');
		return false;
	}
}
