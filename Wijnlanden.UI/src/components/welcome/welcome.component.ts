import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Rsvp } from 'src/classes/enums/rsvp';
import { CodeService } from 'src/services/code.service';
import { FeedbackService } from 'src/services/feedback.service';
import { LoggerService } from 'src/services/logger.service';

@Component({
	selector: 'app-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: [ './welcome.component.scss' ]
})
export class WelcomeComponent implements OnInit, OnDestroy {
	codeFormControl = new FormControl('', [ Validators.required, Validators.maxLength(5), Validators.minLength(5) ]);
	constructor(
		private _router: Router,
		private _feedback: FeedbackService,
		private _authService: CodeService,
		private _logger: LoggerService
	) {}

	ngOnInit(): void {}

	ngOnDestroy(): void {}

	submit(): void {
		this.handleAuthentication(this.codeFormControl.value);
	}

	//Navigation should ideally be done by the guards, but this will have to do for now, as time is limited
	private async handleAuthentication(code: string): Promise<void> {
		try {
			this._feedback.showLoader();
			const person = await this._authService.authenticateWithCode(code);
			if (person) {
				if (person.done && person.rsvp === Rsvp.Yes) {
					this._router.navigate([ '/home' ]);
					return;
				}
				this._router.navigate([ '/profile', 'reservation', `${person.code}` ]);
			} else {
				this.codeFormControl.setErrors({ failedcode: true });
			}
		} catch (error) {
			this._logger.error('Could not authenticate', 'handleAuthentication', error);
			this._feedback.showError();
		} finally {
			this._feedback.hideLoader();
		}
	}
}
