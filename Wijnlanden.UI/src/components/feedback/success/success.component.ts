import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { Guest } from 'src/classes/guest';
import { CodeService } from 'src/services/code.service';
import { LoggerService } from 'src/services/logger.service';

@Component({
	selector: 'app-verificaiton',
	templateUrl: './success.component.html',
	styleUrls: [ './success.component.scss' ]
})
export class SuccessComponent implements OnInit {
	person$: Observable<Guest | undefined> | undefined;
	constructor(private _router: Router, private _authService: CodeService, private _logger: LoggerService) {}

	ngOnInit(): void {
		this.person$ = this._authService.currentGuest$();
	}

	async continue() {
		if (this.person$) {
			const person = await firstValueFrom(this.person$);
			if (person) {
				// await this.authService.verifyPerson();
				this._logger.info('Verified email successfully', 'VerificaitonComponent');
				this._router.navigate([ `/profile`, 'reservation', `${person.code}`, `0` ]);
				return;
			}
		}
		this._logger.error('Could not find you to verify', 'VerificaitonComponent');
		this._router.navigate([ '/welcome' ]);
	}
}
