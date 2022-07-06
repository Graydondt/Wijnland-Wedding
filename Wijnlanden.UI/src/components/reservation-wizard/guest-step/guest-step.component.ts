import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Rsvp } from 'src/classes/enums/rsvp';
import { Guest } from 'src/classes/guest';
import { FeedbackService } from 'src/services/feedback.service';
import { GuestService } from 'src/services/guest.service';
import { LoggerService } from 'src/services/logger.service';

import { MaterialFormsBase } from '../base/material-forms-base';
import { PartnerDetailsComponent } from './partner-details/partner-details.component';

@Component({
	selector: 'guest-step',
	templateUrl: './guest-step.component.html',
	styleUrls: [ './guest-step.component.scss' ]
})
export class GuestStepComponent extends MaterialFormsBase implements OnInit {
	rsvp = Rsvp;
	relatedPerson: Guest | undefined;
	allowPlusOne: boolean = false;
	rsvpForPartner = false;
	showInclude = false;

	@Input() form: FormGroup | undefined;
	@Input() guest: Guest | undefined;
	constructor(
		private _formBuilder: FormBuilder,
		private _guestService: GuestService,
		public dialog: MatDialog,
		private _snackBar: MatSnackBar,
		private _feedback: FeedbackService,
		private _logger: LoggerService
	) {
		super();
	}

	change(event: MatRadioChange) {
		if (!this.guest) return;
		this.guest.rsvp = parseInt(event.value);
	}

	setEmailReminder(event: MatCheckboxChange) {
		if (!this.guest) return;
		this.guest.sendReminder = event.checked;
	}

	updatePerson() {
		if (!this.guest) return;
		if (this.guest.partner && this.rsvpForPartner) {
			this.guest.partner.rsvp = this.guest.rsvp;
		}
		this.applyEmail();
	}

	applyEmail() {
		if (!this.guest || !this.form || !this.form.controls['email'] || !this.form.controls['email'].value) return;
		this.guest.email = this.form.controls['email'].value;
	}

	async ngOnInit(): Promise<void> {
		if (this.guest && this.guest.partner) {
			this.relatedPerson = this.guest.partner;
			this.allowPlusOne = false;
			if (this.guest.partner.addedFromRSVP || this.guest.partner.done || this.guest.partner.rsvp === Rsvp.Yes) {
				this.showInclude = false;
			} else {
				this.showInclude = true;
			}
		} else if (this.guest && this.guest.allowPlusOne) {
			this.allowPlusOne = true;
			this.showInclude = false;
		} else {
			this.relatedPerson = undefined;
			this.allowPlusOne = false;
			this.showInclude = false;
		}
	}

	changed() {
		this.rsvpForPartner = !this.rsvpForPartner;
	}

	async save() {
		try {
			this._feedback.showLoader();
			this.applyEmail();
			await this._guestService.updateGuest();
			this._guestService.logOut();
		} catch (error) {
			this._logger.error('Failed to save guest', 'save', error);
			this._feedback.showError();
		} finally {
			this._feedback.hideLoader();
		}
	}

	openDialog(): void {
		const firstName = new FormControl('', [ Validators.required ]);
		const lastName = new FormControl('', [ Validators.required ]);

		const form = this._formBuilder.group({ firstName, lastName });
		if (form) {
			const dialogRef = this.dialog.open(PartnerDetailsComponent, {
				maxWidth: '600px',
				width: '80vw',
				height: '50vh',
				data: form
			});

			dialogRef.afterClosed().subscribe((result: FormGroup) => {
				console.log('The dialog was closed', result);
				if (result) {
					const firstName = result.controls['firstName'].value;
					const lastName = result.controls['lastName'].value;
					const newPerson = new Guest({ name: firstName, surname: lastName, addedFromRSVP: true });
					if (this.guest && this.form) {
						this.guest.allowPlusOne = false;
						this.guest.partner = newPerson;
						this.relatedPerson = newPerson;
						this.form.controls['plusOne'].setValue(`${firstName} ${lastName}`);
						const snackBar = this._snackBar.open(`Added ${firstName}`, 'Dismiss', { duration: 1000 });
						snackBar.onAction().subscribe(() => {
							snackBar.dismiss();
						});
					}
				}
			});
		}
	}
}
