import { Injectable } from '@angular/core';
import { of, tap } from 'rxjs';
import { IChartData, IFoodData } from 'src/Interfaces/chart-data.interface';

import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root'
})
export class FoodService {
	private _food: IFoodData[] | undefined;
	constructor(private _apiService: ApiService) {}
	getFood() {
		if (this._food && this._food) {
			return of(this._food);
		}
		return this._apiService.get<IFoodData[]>('Food/GetFoodVotes').pipe(
			tap((res) => {
				this._food = res;
			})
		);
	}
}
