import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerComponent } from 'src/components/feedback/spinner/spinner.component';

@Injectable({
	providedIn: 'root'
})
export class FeedbackService {
	constructor(private _dialog: MatDialog, private _snackBar: MatSnackBar) {}

	showLoader() {
		this._dialog.open(SpinnerComponent, { disableClose: true });
	}

	hideLoader() {
		this._dialog.closeAll();
	}

	showError() {
		this._dialog.closeAll();
		this._snackBar.open('⛔ Something went wrong ', 'dismiss', { horizontalPosition: 'center' });
	}
}
