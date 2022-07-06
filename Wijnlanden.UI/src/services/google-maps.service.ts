import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, mergeMap, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Place } from 'src/classes/place';
import { IAppsettings } from 'src/Interfaces/appsettings.interface';

import { LoggerService } from './logger.service';

@Injectable({
	providedIn: 'root'
})
export class GoogleMapsService {
	private _places: Place[] = [];
	private _venuePlaceId = '';

	constructor(private _httpClient: HttpClient, private _logger: LoggerService) {}

	async initializeMap(): Promise<boolean> {
		try {
			return await firstValueFrom(
				this.getAppsettings().pipe(switchMap((appsettings) => this.registerAPIKey(appsettings)))
			);
		} catch (error) {
			this._logger.error('Failed to load maps', 'initializeMap', error);
			return false;
		}
	}

	getPlaces(excludeVenue = false): Place[] {
		if (excludeVenue) {
			return this._places.filter((place) => place.place_Id !== this._venuePlaceId);
		}
		return this._places;
	}

	async findPlaces(location: Place): Promise<Place[]> {
		this._places = [];
		//Hack
		const div = document.createElement('div');
		const placesService = new google.maps.places.PlacesService(div);

		await this.findVenue(placesService, location);
		await this.findNearbyPlaces(placesService, location.coords);
		await this.getPlacesDetails(placesService);
		await this.findDistancesFromVenue(location.place_Id);

		return this._places;
	}

	private registerAPIKey(appsettings: IAppsettings | undefined): Observable<boolean> {
		if (!appsettings || !appsettings.google_maps_api_key) {
			throw new Error('Could not find google api key from appsettings');
		}
		return this._httpClient
			.jsonp(appsettings.google_maps_api_key, 'callback')
			.pipe(map(() => true), catchError(() => of(false)));
	}

	private getAppsettings(): Observable<IAppsettings> {
		return this._httpClient.get<IAppsettings>('../assets/appsettings.json').pipe(
			tap((appsettings) => {
				if (!appsettings || !appsettings.google_maps_api_key) {
					throw new Error('Could not find google api key from appsettings');
				}
			}),
			catchError((error) => {
				this._logger.error('Failed to load appsettings', 'GoogleMapsService.initializeMap', error);
				return throwError(() => new Error(error));
			})
		);
	}

	private async findVenue(placesService: google.maps.places.PlacesService, location: Place) {
		this._venuePlaceId = location.place_Id;
		return new Promise<void>((resolve) => {
			const request: google.maps.places.TextSearchRequest = {
				location: location.coords,
				query: location.name
			};
			placesService.textSearch(request, (result, status) => {
				if (result && status === google.maps.places.PlacesServiceStatus.OK) {
					this.createPlace(result[0]);
				}
				resolve();
			});
		});
	}

	async calculateRoute(start: google.maps.LatLngLiteral, destination: Place, map: google.maps.Map): Promise<void> {
		if (!map) return;
		return new Promise<void>((resolve) => {
			const dirService = new google.maps.DirectionsService();
			const dirRenderer = new google.maps.DirectionsRenderer();

			dirRenderer.setMap(map);

			const request: google.maps.DirectionsRequest = {
				origin: start,
				destination: destination.coords,
				travelMode: google.maps.TravelMode.DRIVING
			};
			dirService.route(request, (result, status) => {
				if (status === google.maps.DirectionsStatus.OK) {
					dirRenderer.setDirections(result);
					resolve();
				}
			});
		});
	}

	private async findNearbyPlaces(
		placesService: google.maps.places.PlacesService,
		location: google.maps.LatLng | google.maps.LatLngLiteral | undefined
	): Promise<google.maps.places.PlaceResult[] | undefined> {
		return new Promise((resolve) => {
			const placeSearchRequest: google.maps.places.PlaceSearchRequest = {
				location,
				rankBy: google.maps.places.RankBy.DISTANCE,
				type: 'lodging'
			};

			placesService.nearbySearch(placeSearchRequest, (places, status, pagination) => {
				if (places && places.length && status === google.maps.places.PlacesServiceStatus.OK) {
					for (const place of places) {
						this.createPlace(place);
					}
					resolve(places);
				}
				resolve(undefined);
			});
		});
	}

	private createPlace(place: google.maps.places.PlaceResult) {
		if (
			!place.place_id ||
			!place.geometry ||
			!place.geometry.location ||
			!place.name ||
			!place.rating ||
			place.rating === 0
		) {
			return;
		}
		const p = new Place(place.place_id, {
			lat: place.geometry.location.lat(),
			lng: place.geometry.location.lng()
		});
		if (place.photos && place.photos.length) {
			p.image = place.photos[0].getUrl();
		}
		p.name = place.name;
		if (place.rating) {
			p.rating = place.rating;
		}
		if (place.formatted_phone_number) {
			p.telephone = place.formatted_phone_number;
		}
		if (place.icon) {
			p.iconURL = place.icon;
		}
		this._places.push(p);
	}

	private async getPlacesDetails(placesService: google.maps.places.PlacesService) {
		for (const place of this._places) {
			const details = await this.getPlaceDetails(place.place_Id, placesService);
			if (!details) continue;

			if (details.url) {
				place.url = details.url;
			}

			if (details.formatted_phone_number) {
				place.telephone = details.formatted_phone_number;
			}
		}
	}

	private async findDistancesFromVenue(venuePlaceId: string): Promise<void> {
		if (!this._places.length) return;
		await this.requestDistanceMatrix(venuePlaceId);
	}

	private async requestDistanceMatrix(venuePlaceId: string): Promise<void> {
		return new Promise((resolve) => {
			const service = new google.maps.DistanceMatrixService();
			const simplePlaces: google.maps.Place[] = [];
			const originPLace: google.maps.Place = {
				placeId: venuePlaceId
			};
			for (const place of this._places) {
				simplePlaces.push({
					placeId: place.place_Id
				});
			}

			const request: google.maps.DistanceMatrixRequest = {
				destinations: simplePlaces,
				travelMode: google.maps.TravelMode.DRIVING,
				origins: [ originPLace ]
			};

			service.getDistanceMatrix(request, (res, status) => {
				this.handleRoutes(res, status);
				resolve();
			});
		});
	}

	private async getPlaceDetails(
		placeId: string,
		placesService: google.maps.places.PlacesService
	): Promise<google.maps.places.PlaceResult | undefined> {
		return new Promise((resolve) => {
			const request: google.maps.places.PlaceDetailsRequest = {
				placeId
			};
			placesService.getDetails(request, (result, status) => {
				if (result && status === google.maps.places.PlacesServiceStatus.OK) {
					resolve(result);
				}
				resolve(undefined);
			});
		});
	}

	private handleRoutes(
		distanceMatrix: google.maps.DistanceMatrixResponse | null,
		status: google.maps.DistanceMatrixStatus
	) {
		if (
			!distanceMatrix ||
			!distanceMatrix.destinationAddresses ||
			!distanceMatrix.destinationAddresses.length ||
			!distanceMatrix.rows ||
			!distanceMatrix.rows[0] ||
			!distanceMatrix.rows[0].elements ||
			distanceMatrix.destinationAddresses.length !== distanceMatrix.rows[0].elements.length
		) {
			return;
		}
		for (let i = 0; i < this._places.length; i++) {
			//This is assuming that the matrix would always return in order requested
			const place = this._places[i];
			const route = distanceMatrix.rows[0].elements[i];
			place.distance = route.distance.text;
			place.avgTime = route.duration.text;
		}
	}
}
