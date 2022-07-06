import { Component, Input, OnInit } from '@angular/core';
import { IChartData } from 'src/Interfaces/chart-data.interface';

@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: [ './results.component.scss' ]
})
export class ResultsComponent implements OnInit {
	ready = false;
	@Input() Data: IChartData[] = [];

	// options
	showXAxis = true;
	showYAxis = true;

	constructor() {}

	ngOnInit(): void {}
}
