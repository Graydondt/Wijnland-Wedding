export class Place {
	place_Id: string;
	image?: string;
	name: string = '';
	rating: number = 0;
	distance: string = 'fail';
	avgTime?: string = 'fail';
	telephone?: string;
	iconURL?: string;
	url: string = '';
	coords: { lat: number; lng: number };

	city = '';
	address = '';
	postalCode = 0;

	constructor(place_Id: string, coords: { lat: number; lng: number }) {
		this.place_Id = place_Id;
		this.coords = coords;
	}
}
