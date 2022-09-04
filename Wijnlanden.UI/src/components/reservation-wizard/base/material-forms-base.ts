import { UntypedFormGroup } from '@angular/forms';
import { MaterialErrorStateMatcher } from 'src/classes/material-error-state-matcher';

export class MaterialFormsBase {
	matcher = new MaterialErrorStateMatcher();
	constructor() {}

	hasError = (control: string, error: string, form: UntypedFormGroup) => {
		if (!form) return;
		return form.controls[control].hasError(error);
	};
}
