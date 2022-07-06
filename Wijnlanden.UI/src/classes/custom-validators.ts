import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
	static checkEmails: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
		if (!group || !group.parent) return null;
		const email = group.parent.get('email');
		if (!email) return null;

		return email.value === group.value ? null : { notSame: true };
	};
}
