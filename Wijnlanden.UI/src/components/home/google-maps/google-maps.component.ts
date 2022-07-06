import { HttpClient } from '@angular/common/http';
import { AfterContentInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { BehaviorSubject, catchError, filter, map, mergeMap, Observable, of, tap } from 'rxjs';
import { Place } from 'src/classes/place';
import { FeedbackService } from 'src/services/feedback.service';
import { GoogleMapsService } from 'src/services/google-maps.service';
import { LoggerService } from 'src/services/logger.service';

@Component({
	selector: 'app-google-maps',
	templateUrl: './google-maps.component.html',
	styleUrls: [ './google-maps.component.scss' ]
})
export class GoogleMapsComponent implements OnInit, AfterContentInit {
	@ViewChild(GoogleMap) googleMap: GoogleMap | undefined;

	@Input() loadingMap$: BehaviorSubject<boolean> | undefined;
	@Input() loadingNearbyPlaces$: BehaviorSubject<boolean> | undefined;

	private readonly venue: Place = {
		name: 'Wijnlanden Uitzicht Venue',
		city: 'Stellenbosch',
		address: 'Wild Clover Farm R304 Koelenhof',
		postalCode: 7600,
		coords: { lat: -33.84748443071381, lng: 18.80322991383837 },
		place_Id: 'ChIJvc9cQDdTzB0RyZ-77UoQpdA',
		url: 'https://www.google.com/maps?cid=15034440845048389577',
		rating: 0,
		distance: '0 km',
		avgTime: '0'
	};

	options: google.maps.MapOptions = {
		center: this.venue.coords,
		zoom: 14,
		backgroundColor: '#f1d97f',
		disableDefaultUI: true,
		gestureHandling: 'cooperative'
	};

	parentDimensions: { width: number; height: number } | undefined;

	pubMarkers: any[] = [];
	apiLoaded: boolean = false;
	private markers: any[] = [];

	constructor(
		private _elRef: ElementRef,
		private _mapService: GoogleMapsService,
		private _logger: LoggerService,
		private _feedback: FeedbackService
	) {}

	ngAfterContentInit(): void {
		this.parentDimensions = {
			width: this._elRef.nativeElement.parentElement.offsetWidth,
			height: 300
		};
		this.initMap();
	}

	private async initMap() {
		this.apiLoaded = await this._mapService.initializeMap();
		if (this.loadingMap$) {
			this.loadingMap$.next(!this.apiLoaded);
		}
	}

	ngOnInit(): void {}

	showAllPlaces() {
		this.pubMarkers.push(...this.markers);
	}

	async mapLoaded() {
		//Adding Venue Marker
		try {
			this.addVenueMarker(this.venue.coords, this.venue.name, this.venue.place_Id);
			const places = await this._mapService.findPlaces(this.venue);
			if (!places) throw new Error('No places found');
			this.createMarkersForPlaces(places);
			if (this.loadingNearbyPlaces$) {
				this.loadingNearbyPlaces$.next(false);
			}
		} catch (error) {
			this._logger.error('Could not load map meta data', 'mapLoaded', error);
			this._feedback.showError();
		}
	}

	async openRoute(destination: Place) {
		let url = 'https://www.google.com/maps/dir/?api=1';
		url += `&origin=${this.venue.name}`;
		url += `&origin_place_id=${this.venue.place_Id}`;
		url += `&destination=${destination.name}`;
		url += `&destination_place_id=${destination.place_Id}`;
		url += '&travelmode=driving';

		window.open(encodeURI(url));
	}

	private createMarkersForPlaces(places: Place[]) {
		for (const place of places) {
			let icon: google.maps.Icon;
			if (place.iconURL) {
				icon = {
					url: place.iconURL
				};
				this.addLodgingMarker(place.coords, place.name, place.place_Id, icon);
				continue;
			}
			this.addLodgingMarker(place.coords, place.name, place.place_Id);
		}
	}

	private addLodgingMarker(
		position: { lat: number; lng: number },
		label: string,
		place_Id: string,
		icon?: google.maps.Icon
	) {
		const marker = this.createMarker(position, label, place_Id, icon);
		this.markers.push(marker);
	}

	private addVenueMarker(
		position: { lat: number; lng: number },
		label: string,
		place_Id: string,
		icon?: google.maps.Icon
	) {
		const marker = this.createMarker(position, label, place_Id, icon);
		this.pubMarkers.push(marker);
	}

	private createMarker(
		position: { lat: number; lng: number },
		label: string,
		place_Id: string,
		icon?: google.maps.Icon
	) {
		const marker = new google.maps.Marker({
			position,
			label,
			icon,
			animation: google.maps.Animation.BOUNCE
		});

		marker.addListener('click', () => {
			if (place_Id) {
				this.showInfoWindow(marker, place_Id);
			}
		});
		return marker;
	}

	private showInfoWindow(marker: google.maps.Marker, placeId: string) {
		if (!this.googleMap || !this.googleMap.googleMap) return;

		const place = this._mapService.getPlaces().find((place) => place.place_Id === placeId);
		if (!place) return;

		const options: google.maps.InfoWindowOptions = {
			position: marker.getPosition(),
			minWidth: 200,
			content: this.buildIWContent(place)
		};
		const infoWindow = new google.maps.InfoWindow(options);
		infoWindow.open(this.googleMap.googleMap, marker);
	}

	private buildIWContent(place: Place): Element {
		const div = document.createElement('div');
		div.style.textAlign = 'center';

		div.innerHTML = `<img class="hotelIcon" src="${place.iconURL}"/>`;
		div.innerHTML += '<br>';
		div.innerHTML += `<b><a href="${place.url}" target="_blank"> ${place.name}</a></b>`;
		div.innerHTML += '<br>';
		div.innerHTML += '<br>';

		if (place.telephone) {
			div.innerHTML += `<p><strong>Telephone:</strong></p> <a href="tel:${place.telephone}">${place.telephone}</a`;
		}
		return div;
	}
}
