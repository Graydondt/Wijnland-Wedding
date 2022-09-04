import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MaterialFormsBase } from '../../base/material-forms-base';

@Component({
	selector: 'partner-details',
	templateUrl: './partner-details.component.html',
	styleUrls: [ './partner-details.component.scss' ]
})
export class PartnerDetailsComponent extends MaterialFormsBase implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<PartnerDetailsComponent>,
		@Inject(MAT_DIALOG_DATA) public data: UntypedFormGroup
	) {
		super();
	}

	ngOnInit(): void {}
	onNoClick(): void {
		this.dialogRef.close();
	}
}
