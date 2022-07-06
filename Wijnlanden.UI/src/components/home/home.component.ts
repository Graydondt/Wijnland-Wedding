import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, firstValueFrom, Observable, Subject, takeUntil, tap } from 'rxjs';
import { Guest } from 'src/classes/guest';
import { MenuItem } from 'src/classes/menu-item';
import { Place } from 'src/classes/place';
import { OffsetTopDirective } from 'src/directives/offset-top.directive';
import { ScrollableDirective } from 'src/directives/scrollable.directive';
import { IChartData, IFoodData } from 'src/Interfaces/chart-data.interface';
import { FoodService } from 'src/services/food.service';
import { GoogleMapsService } from 'src/services/google-maps.service';
import { GuestService } from 'src/services/guest.service';

import { GoogleMapsComponent } from './google-maps/google-maps.component';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit, OnDestroy {
	@ViewChildren(OffsetTopDirective) listItems: QueryList<OffsetTopDirective> | undefined;
	@ViewChild(ScrollableDirective) list: ScrollableDirective | undefined;
	@ViewChild(MatSort) sort: MatSort | undefined;
	@ViewChild(GoogleMapsComponent) map: GoogleMapsComponent | undefined;

	menuItems: MenuItem[] = [];

	lodgingSource: MatTableDataSource<Place> | undefined;
	displayColumns: string[] = [];
	columns: { columnDef: string; header: string; cell: (element: Place) => {} }[] = [];

	guest$: Observable<Guest | undefined> | undefined;
	loadingMap$ = new BehaviorSubject(true);
	loadingNearbyPlaces$ = new BehaviorSubject(true);

	foods = [ 'Canapés', 'Mains', 'Sides', 'Desserts' ];
	selectedFood = 'Canapés';
	foodResults$: Observable<IFoodData[]> | undefined;
	loadingFood = true;
	canapesData: IChartData[] = [ { name: 'Option 1', value: 10 } ];
	mainsData: IChartData[] = [ { name: 'Steak', value: 5 } ];
	sidesData: IChartData[] = [ { name: 'Mielies', value: 20 } ];
	dessertsData: IChartData[] = [ { name: 'Malva', value: 13 } ];

	private _weddingDay = new Date(2022, 5, 25);

	get daysTill() {
		const today = new Date();
		const remainingMonths = this._weddingDay.getUTCMonth() - today.getUTCMonth();
		const remainingDays = this._weddingDay.getUTCDate() - today.getUTCDate() + 1;
		let monthString = '';
		if (remainingMonths > 1) {
			monthString = `${remainingMonths} Months`;
		} else if (remainingMonths === 1) {
			monthString = `${remainingMonths} Month`;
		}
		let dayString = '';
		if (remainingDays > 1) {
			dayString = `${remainingDays} Days`;
		} else if (remainingDays === 1) {
			dayString = `${remainingDays} Day`;
		}
		let andString = '';
		if (dayString) {
			andString = 'and';
		}
		return `${monthString ? `${monthString} ${andString}`.trim() : ''} ${dayString ? dayString : ''}`;

		// const dateNow = new Date();
		// const weddingDay = new Date(2022, 5, 25);
		// const milliSecondsInASecond = 1000;
		// const hoursInADay = 24;
		// const minutesInAnHour = 60;
		// const SecondsInAMinute = 60;

		// const timeDifference = weddingDay.getTime() - dateNow.getTime();
		// const daysToDday = Math.floor(
		// 	timeDifference / (milliSecondsInASecond * minutesInAnHour * SecondsInAMinute * hoursInADay)
		// );
		// return daysToDday > 1 ? `${daysToDday} Days left` : `${daysToDday} Day left`;
	}

	private destroy$ = new Subject();

	constructor(
		private _guestService: GuestService,
		private _foodService: FoodService,
		private _mapsService: GoogleMapsService
	) {}

	ngOnInit(): void {
		this.getFood();
		this.prepareLodgingData();
		this.setMenuItems();
		this.guest$ = this._guestService.guest$.asObservable();
	}

	ngOnDestroy(): void {
		if (this.destroy$) {
			this.destroy$.next(true);
		}
	}

	openVenue() {
		window.open('https://www.google.com/maps?cid=15034440845048389577');
	}

	async selectPlace(place: Place) {
		if (!this.map) return;
		await this.map.openRoute(place);
	}

	private async getFood() {
		this.foodResults$ = this._foodService.getFood().pipe(
			tap((res) => {
				this.canapesData = [];
				this.mainsData = [];
				this.sidesData = [];
				this.dessertsData = [];
				for (const item of res) {
					switch (item.categoryName) {
						case 'Canapes':
							for (const key in item.data) {
								const name = key;
								let value = item.data[key];
								value = value ? value : 0;
								this.canapesData.push({ name, value });
							}
							break;
						case 'Mains':
							for (const key in item.data) {
								const name = key;
								let value = item.data[key];
								value = value ? value : 0;
								this.mainsData.push({ name, value });
							}
							break;
						case 'Sides':
							for (const key in item.data) {
								const name = key;
								let value = item.data[key];
								value = value ? value : 0;
								this.sidesData.push({ name, value });
							}
							break;
						case 'Desserts':
							for (const key in item.data) {
								const name = key;
								let value = item.data[key];
								value = value ? value : 0;
								this.dessertsData.push({ name, value });
							}
							break;
					}
				}
				this.loadingFood = false;
			})
		);
	}

	private setMenuItems() {
		const about: MenuItem = {
			title: 'About',
			icon: 'info',
			action: () => this.scrollToElement(0)
		};

		const results: MenuItem = {
			title: 'Results',
			icon: 'check',
			action: () => this.scrollToElement(1)
		};

		const map: MenuItem = {
			title: 'Venue',
			icon: 'map',
			action: () => this.scrollToElement(2)
		};

		const lodging: MenuItem = {
			title: 'Lodging',
			icon: 'hotel',
			action: () => this.scrollToElement(3)
		};

		this.menuItems = [ about, results, map, lodging ];
	}

	private async prepareLodgingData() {
		this.columns = [
			{
				columnDef: 'distance',
				header: 'Distance',
				cell: (element: Place) => `${element.distance}`
			},
			{
				columnDef: 'name',
				header: 'Name',
				cell: (element: Place) => `${element.name}`
			},
			// {
			// 	columnDef: 'rating',
			// 	header: 'Rating',
			// 	cell: (element: Place) => `${element.rating}`
			// },
			{
				columnDef: 'action',
				header: 'Action',
				cell: (element: Place) => `${element.avgTime}`
			}
		];

		this.loadingNearbyPlaces$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
			if (res === false) {
				const places = this._mapsService.getPlaces(true);

				if (places) {
					this.lodgingSource = new MatTableDataSource(places);
				}
				this.displayColumns = this.columns.map((c) => c.columnDef);

				requestAnimationFrame(() => {
					if (!this.lodgingSource || !this.sort) return;
					this.sort.sort({ id: 'distance', start: 'asc' } as MatSortable);
					this.lodgingSource.sort = this.sort;
				});
			}
		});
	}

	private scrollToElement(index: number) {
		if (!this.list || !this.listItems || !this.listItems.length) return;
		const test = this.listItems.find((_, i) => i === index);
		if (test) {
			//The 200 was just guessing
			this.list.scrollTop = test.offsetTop - 200;
		}
	}

	navigate(url: string) {
		window.open(url, '_self');
	}
}
