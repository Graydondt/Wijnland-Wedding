import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { CustomValidators } from 'src/classes/custom-validators';
import { Rsvp } from 'src/classes/enums/rsvp';
import { Guest } from 'src/classes/guest';

import { CodeService } from '../../services/code.service';
import { MaterialFormsBase } from './base/material-forms-base';

@Component({
	selector: 'app-reservation-wizard',
	templateUrl: './reservation-wizard.component.html',
	styleUrls: [ './reservation-wizard.component.scss' ]
})
export class ReservationWizardComponent extends MaterialFormsBase implements OnInit {
	step1: FormGroup | undefined;
	step2: FormGroup | undefined;
	currentStep = 0;
	rsvp = Rsvp;
	guest$: Observable<Guest | undefined> | undefined;

	constructor(private _fromBuilder: FormBuilder, private _authService: CodeService, private _route: ActivatedRoute) {
		super();
	}

	async ngOnInit(): Promise<void> {
		this._route.params
			.pipe(
				tap(async (params) => {
					if (params && params['step']) {
						await this.currentGuest();
						this.currentStep = params['step'];
					}
				})
			)
			.subscribe();
		await this.currentGuest();
		await this.setupForms();
		this.setDefaults();
	}

	currentGuest() {
		this.guest$ = this._authService.currentGuest$();
	}

	private async setupForms() {
		if (!this.guest$) return;

		const guest = await firstValueFrom(this.guest$);
		if (!guest) return;

		this.setupStep1(guest);
		this.setupStep2();
	}

	private setupStep1(guest: Guest) {
		const firstName = new FormControl<string>({ value: '', disabled: true }, []);
		const plusOne = new FormControl<string>({ value: '', disabled: true }, []);
		const rsvp = new FormControl<number>(Rsvp.Unknown, [ Validators.required ]);
		const rsvpReminder = new FormControl<boolean>(false, []);
		if (!guest.done) {
			const email = new FormControl<string>('', [ Validators.required, Validators.email ]);
			const confirmEmail = new FormControl<string>('', [ Validators.required, CustomValidators.checkEmails ]);
			this.step1 = this._fromBuilder.group({ firstName, plusOne, rsvp, rsvpReminder, email, confirmEmail });
		} else {
			this.step1 = this._fromBuilder.group({ firstName, plusOne, rsvp, rsvpReminder });
		}
	}

	private setupStep2() {
		const email = new FormControl<string>('', [ Validators.required, Validators.email ]);
		this.step2 = this._fromBuilder.group({ email });
	}

	private async setDefaults() {
		if (this.guest$) {
			const person = await firstValueFrom(this.guest$);
			if (person) {
				this.setControlValue('firstName', `${person.name} ${person.surname}`);
				this.setControlValue('rsvp', person.rsvp);
				this.setControlValue('rsvpReminder', person.sendReminder);
				if (person.partner) {
					this.setControlValue('plusOne', `${person.partner.name} ${person.partner.surname}`);
				}
			}
		}
	}

	private setControlValue(control: string, value: string | boolean | Rsvp) {
		if (this.step1) {
			this.step1.controls[control].setValue(value);
		}
	}
}
