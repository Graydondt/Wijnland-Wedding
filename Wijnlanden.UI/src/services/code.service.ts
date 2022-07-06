import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Guest } from 'src/classes/guest';

import { GuestService } from './guest.service';

@Injectable({
	providedIn: 'root'
})
export class CodeService {
	constructor(private _personService: GuestService) {}

	logOut() {
		this._personService.logOut();
	}

	currentGuest$(): Observable<Guest | undefined> {
		return this._personService.guest$.asObservable();
	}

	async saveCurrentPerson() {
		await this._personService.updateGuest();
	}

	isValidAuthCode(): BehaviorSubject<boolean> {
		return this._personService.isValidAuthCode$;
	}

	authenticateWithCode(code: string): Promise<Guest | undefined> {
		return this._personService.getGuest(code);
	}

	findCodeFromStorage(): string | null {
		return this._personService.findCodeFromStorage();
	}
}
