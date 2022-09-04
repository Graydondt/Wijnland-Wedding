
import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
	selector: 'app-venue-details',
	templateUrl: './venue-details.component.html',
	styleUrls: [ './venue-details.component.scss' ]
})
export class VenueDetailsComponent implements OnInit {
	@Input() template: TemplateRef<any> | undefined;
	constructor() {}

	ngOnInit(): void {}
}
