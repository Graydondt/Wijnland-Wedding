import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom, tap } from 'rxjs';
import { Guest } from 'src/classes/guest';
import { IAppsettings } from 'src/Interfaces/appsettings.interface';
import { IGuest } from 'src/Interfaces/guest.interface';

import { ApiService } from './api.service';
import { LoggerService } from './logger.service';

@Injectable({
	providedIn: 'root'
})
export class GuestService {
	private readonly _codeKey = 'wijnland_auth';
	private readonly _controller = 'Guest';
	guest$: BehaviorSubject<Guest | undefined> = new BehaviorSubject<Guest | undefined>(undefined);
	isValidAuthCode$ = new BehaviorSubject(false);

	constructor(private _apiService: ApiService, private _logger: LoggerService, private _router: Router) {}

	async getGuest(code: string): Promise<Guest | undefined> {
		try {
			let params = new HttpParams().set('code', code);
			const guest = await firstValueFrom(
				this._apiService.get<IGuest>(`${this._controller}/GetGuest`, { params })
			);

			if (guest) {
				this.guest$.next(guest);
				this.isValidAuthCode$.next(true);
				this.addCodeToStorage(code);
			} else {
				this._logger.warn('invalid Code', 'getGuest', code);
				this.isValidAuthCode$.next(false);
				this.logOut();
			}

			return guest;
		} catch (error) {
			this._logger.fatal('Something went wrong whilst trying to get guest', 'getGuest', error);
			return Promise.resolve(undefined);
		}
	}

	async updateGuest(): Promise<boolean> {
		const guest = await firstValueFrom(this.guest$);
		try {
			await firstValueFrom(
				this._apiService.post(`${this._controller}/UpdateGuest`, guest, {
					headers: {
						'Content-Type': 'application/json'
					}
				})
			);
			if (guest && guest.email) {
				guest.done = true;
			}
		} catch (error) {
			this._logger.error('Could not update guest', 'updateGuest', error);
			throw error;
		}
		return true;
	}

	findCodeFromStorage(): string | null {
		return localStorage.getItem(this._codeKey);
	}

	logOut() {
		localStorage.removeItem(this._codeKey);
		this.guest$.next(undefined);
		this.isValidAuthCode$.next(false);
		this._router.navigate([ '/' ]);
	}

	private addCodeToStorage(code: string) {
		localStorage.setItem(this._codeKey, code);
		this._logger.debug('Added code to localstorage', 'CodeAuthenticationService');
	}
}
