import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';
import { IAppsettings } from 'src/Interfaces/appsettings.interface';

import { LoggerService } from './logger.service';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private _apiPath: string | undefined;

	constructor(private _httpClient: HttpClient, private _logger: LoggerService, private _router: Router) {
		this.setApiURL();
	}

	get<T>(
		url: string,
		options?:
			| {
					headers?:
						| {
								[header: string]: string | string[];
							}
						| undefined;
					context?: HttpContext | undefined;
					observe?: 'body' | undefined;
					params?:
						| HttpParams
						| {
								[param: string]: string | number | boolean;
							};
					reportProgress?: boolean | undefined;
					responseType?: 'json' | undefined;
					withCredentials?: boolean | undefined;
				}
			| undefined
	): Observable<T> {
		options = this.configureOptions(options);
		if (!this.hasApiURL()) {
			const setup = this.setApiURL();
			if (!setup) {
				this._logger.error('Could not execute request', 'get');
				throw new Error('Could not execute request');
			}
			return setup.pipe(
				switchMap(() => {
					return this._httpClient.get<T>(`${this._apiPath}/${url}`, options);
				})
			);
		}
		return this._httpClient.get<T>(`${this._apiPath}/${url}`, options);
	}

	post<T>(
		url: string,
		body: any,
		options?:
			| {
					headers?:
						| {
								[header: string]: string | string[];
							}
						| undefined;
					context?: HttpContext | undefined;
					observe?: 'body' | undefined;
					params?:
						| HttpParams
						| {
								[param: string]: string | number | boolean;
							};
					reportProgress?: boolean | undefined;
					responseType?: 'json' | undefined;
					withCredentials?: boolean | undefined;
				}
			| undefined
	) {
		options = this.configureOptions(options);
		if (!this.hasApiURL()) {
			const setup = this.setApiURL();
			if (!setup) {
				this._logger.error('Could not execute request', 'get');
				throw new Error('Could not execute request');
			}

			return setup.pipe(
				switchMap(() => {
					return this._httpClient.post<T>(`${this._apiPath}/${url}`, body, options);
				})
			);
		}
		return this._httpClient.post<T>(`${this._apiPath}/${url}`, body, options);
	}

	private configureOptions(
		options?:
			| {
					headers?:
						| {
								[header: string]: string | string[];
							}
						| undefined;
					context?: HttpContext | undefined;
					observe?: 'body' | undefined;
					params?:
						| HttpParams
						| {
								[param: string]: string | number | boolean;
							};
					reportProgress?: boolean | undefined;
					responseType?: 'json' | undefined;
					withCredentials?: boolean | undefined;
				}
			| undefined
	) {
		if (!options) {
			options = {};
		}
		const _secret = 'super-unsafe-authentication-but-yolo';
		if (options.headers) {
			options.headers['secret'] = _secret;
		} else {
			options.headers = { secret: _secret };
		}
		return options;
	}

	private setApiURL() {
		if (this.hasApiURL()) return;
		return this._httpClient.get<IAppsettings>('../assets/appsettings.json').pipe(
			tap((appsettings) => {
				if (!appsettings || !appsettings.api_url) {
					throw new Error('Could not find api url from appsettings');
				}
				this._apiPath = appsettings.api_url;
			}),
			catchError((error) => {
				this._logger.error('Failed to load appsettings', 'GuestService.setApiURL', error);
				this._router.navigate([ '/not-found' ]);
				return of(undefined);
			})
		);
	}

	private hasApiURL(): boolean {
		if (this._apiPath) {
			return true;
		}
		return false;
	}
}
