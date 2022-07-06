import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Guest } from 'src/classes/guest';
import { MenuItem } from 'src/classes/menu-item';
import { CodeService } from 'src/services/code.service';

@Component({
	selector: 'app-navigation-bar',
	templateUrl: './navigation-bar.component.html',
	styleUrls: [ './navigation-bar.component.scss' ]
})
export class NavigationBarComponent implements OnInit {
	@Input() menuItems: MenuItem[] = [];

	userName = '';
	guest$: Observable<Guest | undefined> | undefined;

	constructor(private _router: Router, private _authService: CodeService) {}

	ngOnInit(): void {
		this.setupListeners();
	}

	private setupListeners() {
		this._authService
			.isValidAuthCode()
			.asObservable()
			.pipe(
				tap(async (authed) => {
					if (authed) {
						this.guest$ = this._authService.currentGuest$();
					} else {
						this.userName = '';
					}
				})
			)
			.subscribe();
	}

	navigate(url: string, navigateByUrl: boolean = false) {
		if (navigateByUrl) {
			window.open(url, '_self');
		} else {
			this._router.navigate([ url ]);
		}
	}

	logOut() {
		this._authService.logOut();
		this._router.navigateByUrl('');
	}
}
