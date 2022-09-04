import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Food } from 'src/classes/food';
import { Guest } from 'src/classes/guest';
import { CodeService } from 'src/services/code.service';
import { FeedbackService } from 'src/services/feedback.service';
import { LoggerService } from 'src/services/logger.service';

@Component({
	selector: 'food-step',
	templateUrl: './food-step.component.html',
	styleUrls: [ './food-step.component.scss' ]
})
export class FoodStepComponent implements OnInit {
	canapesForm: UntypedFormGroup | undefined;
	canapeKeys: string[] = [];
	canapes: { [key: string]: string } = {};
	canapesError = true;
	readonly canapeMax = 2;

	mainsForm: UntypedFormGroup | undefined;
	mainsKeys: string[] = [];
	mains: { [key: string]: string } = {};
	mainsError = true;
	private readonly mainsMax = 5;

	sidesForm: UntypedFormGroup | undefined;
	sidesKeys: string[] = [];
	sides: { [key: string]: string } = {};
	sidesError = true;
	private readonly sidesMax = 6;

	dessertsForm: UntypedFormGroup | undefined;
	dessertKeys: string[] = [];
	desserts: { [key: string]: string } = {};
	dessertsError = true;
	private readonly dessertsMax = 3;

	@Input() guest: Guest | undefined;
	constructor(
		private _builder: UntypedFormBuilder,
		private _feedback: FeedbackService,
		private _authService: CodeService,
		private _logger: LoggerService,
		private _router: Router
	) {}

	ngOnInit(): void {
		this.getFood();
		this.buildForms();
		this.setDefaults();
	}

	checkCanapes() {
		if (!this.canapesForm) return;

		const selected = this.checkTotal(this.canapesForm, this.canapeMax);
		if (selected.length !== this.canapeMax) {
			this.canapesError = true;
		} else {
			this.canapesError = false;
		}
	}

	checkMains() {
		if (!this.mainsForm) return;
		const selected = this.checkTotal(this.mainsForm, this.mainsMax);
		if (selected.length !== this.mainsMax) {
			this.mainsError = true;
		} else {
			this.mainsError = false;
		}
	}

	checkSides() {
		if (!this.sidesForm) return;
		const selected = this.checkTotal(this.sidesForm, this.sidesMax);

		if (selected.length !== this.sidesMax) {
			this.sidesError = true;
		} else {
			this.sidesError = false;
		}
	}

	checkDesserts() {
		if (!this.dessertsForm) return;
		const selected = this.checkTotal(this.dessertsForm, this.dessertsMax);
		if (selected.length !== this.dessertsMax) {
			this.dessertsError = true;
		} else {
			this.dessertsError = false;
		}
	}

	applyChanges() {
		if (!this.guest || !this.canapesForm || !this.mainsForm || !this.sidesForm || !this.dessertsForm) return;
		this.guest.canapes = this.findSelectedKeys(this.canapesForm);
		this.guest.mains = this.findSelectedKeys(this.mainsForm);
		this.guest.sides = this.findSelectedKeys(this.sidesForm);
		this.guest.desserts = this.findSelectedKeys(this.dessertsForm);

		//This should prevent people from overriding their partners
		if (!this.guest.partner || this.guest.partner.done || this.guest.partner.addedFromRSVP) return;

		this.guest.partner.canapes = this.findSelectedKeys(this.canapesForm);
		this.guest.partner.mains = this.findSelectedKeys(this.mainsForm);
		this.guest.partner.sides = this.findSelectedKeys(this.sidesForm);
		this.guest.partner.desserts = this.findSelectedKeys(this.dessertsForm);
	}

	async save() {
		this.applyChanges();
		try {
			this._feedback.showLoader();
			await this._authService.saveCurrentPerson();
			this._router.navigateByUrl('/');
		} catch (error) {
			this._logger.error('Could not save Guest', 'save', error);
			this._feedback.showError();
		} finally {
			this._feedback.hideLoader();
		}
	}

	private findSelectedKeys(form: UntypedFormGroup): string[] {
		const keys = Object.keys(form.controls);
		const selection: string[] = [];
		for (const key of keys) {
			if (form.controls[key].value === true) {
				selection.push(key);
			}
		}
		return selection;
	}

	private checkTotal(form: UntypedFormGroup, allowed: number) {
		const selected: string[] = [];
		const values: boolean[] = [];
		const keys = Object.keys(form.controls);
		for (const key of keys) {
			const value = form.controls[key].value;
			values.push(value);
			if (value === true) {
				selected.push(key);
			} else if (selected.find((sel) => sel === key)) {
				selected.splice(selected.indexOf(key), 1);
			}
		}

		if (selected.length >= allowed) {
			const controlsToDisable = keys.filter((key) => !selected.find((sel) => sel === key));
			for (const key of controlsToDisable) {
				form.controls[key].disable();
			}
		} else {
			for (const key of keys) {
				form.controls[key].enable();
			}
		}
		return selected;
	}

	getCanapeVotesString(): string {
		if (this.canapesForm) {
			const values = Object.values(this.canapesForm.controls).filter((control) => control.value === true);
			return `${values.length} of ${this.canapeMax}`;
		} else {
			return 'Error';
		}
	}

	getMainsVotesString(): string {
		if (this.mainsForm) {
			const values = Object.values(this.mainsForm.controls).filter((control) => control.value === true);
			return `${values.length} of ${this.mainsMax}`;
		} else {
			return 'Error';
		}
	}

	getSidesVotesString(): string {
		if (this.sidesForm) {
			const values = Object.values(this.sidesForm.controls).filter((control) => control.value === true);
			return `${values.length} of ${this.sidesMax}`;
		} else {
			return 'Error';
		}
	}

	getDessertsVotesString(): string {
		if (this.dessertsForm) {
			const values = Object.values(this.dessertsForm.controls).filter((control) => control.value === true);
			return `${values.length} of ${this.dessertsMax}`;
		} else {
			return 'Error';
		}
	}

	getDescriptionParts(description: string): string[] {
		return description.split(';');
	}

	private buildForms() {
		this.buildCanapes();
		this.buildMains();
		this.buildSides();
		this.buildDesserts();
	}

	private getFood() {
		this.canapes = Food.getCanapes();
		this.mains = Food.getMains();
		this.sides = Food.getSides();
		this.desserts = Food.getDesserts();
	}

	private buildCanapes() {
		this.canapeKeys = Object.keys(this.canapes);
		const config: {
			[key: string]: UntypedFormControl;
		} = {};
		this.canapeKeys.forEach((key) => {
			config[key] = new UntypedFormControl();
		});

		this.canapesForm = this._builder.group(config);
	}

	private buildMains() {
		this.mainsKeys = Object.keys(this.mains);

		const config: {
			[key: string]: UntypedFormControl;
		} = {};
		this.mainsKeys.forEach((key) => {
			config[key] = new UntypedFormControl();
		});

		this.mainsForm = this._builder.group(config);
	}

	private buildSides() {
		this.sidesKeys = Object.keys(this.sides);

		const config: {
			[key: string]: UntypedFormControl;
		} = {};
		this.sidesKeys.forEach((key) => {
			config[key] = new UntypedFormControl();
		});

		this.sidesForm = this._builder.group(config);
	}

	private buildDesserts() {
		this.dessertKeys = Object.keys(this.desserts);

		const config: {
			[key: string]: UntypedFormControl;
		} = {};
		this.dessertKeys.forEach((key) => {
			config[key] = new UntypedFormControl();
		});

		this.dessertsForm = this._builder.group(config);
	}

	private setDefaults() {
		if (!this.guest) return;

		if (this.guest.canapes && this.guest.canapes.length && this.canapesForm) {
			for (const key of this.guest.canapes) {
				const control = this.canapesForm.controls[key];
				control.setValue(true);
			}
			const selected = this.checkTotal(this.canapesForm, this.canapeMax);
			if (selected.length !== this.canapeMax) {
				this.canapesError = true;
			} else {
				this.canapesError = false;
			}
		}

		if (this.guest.mains && this.guest.mains.length && this.mainsForm) {
			for (const key of this.guest.mains) {
				const control = this.mainsForm.controls[key];
				control.setValue(true);
			}
			const selected = this.checkTotal(this.mainsForm, this.mainsMax);
			if (selected.length !== this.mainsMax) {
				this.mainsError = true;
			} else {
				this.mainsError = false;
			}
		}

		if (this.guest.sides && this.guest.sides.length && this.sidesForm) {
			for (const key of this.guest.sides) {
				const control = this.sidesForm.controls[key];
				control.setValue(true);
			}
			const selected = this.checkTotal(this.sidesForm, this.sidesMax);
			if (selected.length !== this.sidesMax) {
				this.sidesError = true;
			} else {
				this.sidesError = false;
			}
		}

		if (this.guest.desserts && this.guest.desserts.length && this.dessertsForm) {
			for (const key of this.guest.desserts) {
				const control = this.dessertsForm.controls[key];
				control.setValue(true);
			}
			const selected = this.checkTotal(this.dessertsForm, this.dessertsMax);
			if (selected.length !== this.dessertsMax) {
				this.dessertsError = true;
			} else {
				this.dessertsError = false;
			}
		}
	}
}
