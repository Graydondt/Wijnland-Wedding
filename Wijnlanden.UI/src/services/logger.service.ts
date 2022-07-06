import { Injectable } from '@angular/core';
import { LogLevel, LogType } from 'src/classes/enums/log-level';

@Injectable({
	providedIn: 'root'
})
export class LoggerService {
	level: LogLevel = LogLevel.Error;

	debug(msg: string, methodName: string, ...optionalParams: any[]) {
		this.writeToLog(msg, methodName, LogLevel.Debug, LogType.Trace, 'color:cyan;', optionalParams);
	}

	info(msg: string, methodName: string, ...optionalParams: any[]) {
		this.writeToLog(msg, methodName, LogLevel.Info, LogType.Info, 'color:cornflowerblue;', optionalParams);
	}

	warn(msg: string, methodName: string, ...optionalParams: any[]) {
		this.writeToLog(msg, methodName, LogLevel.Warn, LogType.Warn, 'color:lightyellow;', optionalParams);
	}

	error(msg: string, methodName: string, ...optionalParams: any[]) {
		this.writeToLog(msg, methodName, LogLevel.Error, LogType.Error, 'color:orangered;', optionalParams);
	}

	fatal(msg: string, methodName: string, ...optionalParams: any[]) {
		this.writeToLog(msg, methodName, LogLevel.Fatal, LogType.Critical, 'color:red;', optionalParams);
	}
	log(msg: string, methodName: string, ...optionalParams: any[]) {
		this.writeToLog(msg, methodName, LogLevel.All, LogType.Default, 'color:white;', optionalParams);
	}

	private writeToLog(msg: string, methodName: string, level: LogLevel, type: LogType, style: string, params: any[]) {
		if (this.shouldLog(level)) {
			let value: string = '';

			if (this.level < 1) {
				value += `Method: ${methodName}()`;
			}

			value += ' - Message: ' + msg;

			switch (type) {
				case LogType.Info:
					if (params && params.length) {
						console.info(`%c ${value}`, style, params);
						break;
					}
					console.info(`%c ${value}`, style);
					break;

				case LogType.Trace:
					if (params && params.length) {
						console.trace(`%c ${value}`, style, params);
						break;
					}
					console.trace(`%c ${value}`, style);
					break;
				case LogType.Warn:
					if (params && params.length) {
						console.warn(`%c ${value}`, style, params);
						break;
					}
					console.warn(`%c ${value}`, style);
					break;
				case LogType.Error:
				case LogType.Critical:
					if (params && params.length) {
						console.error(`%c ${value}`, style, params);
						break;
					}
					console.error(`%c ${value}`, style);
					break;

				case LogType.Default:
				default:
					if (params && params.length) {
						console.log(`%c ${value}`, style, params);
						break;
					}
					console.log(`%c ${value}`, style);
					break;
			}
		}
	}

	private shouldLog(level: LogLevel): boolean {
		let ret: boolean = false;
		if ((level >= this.level && level !== LogLevel.Off) || this.level === LogLevel.All) {
			ret = true;
		}
		return ret;
	}

	private formatParams(params: any[]): string {
		let ret: string = params.join(',');

		// Is there at least one object in the array?
		if (params.some((p) => typeof p == 'object')) {
			ret = '';

			// Build comma-delimited string
			for (let item of params) {
				ret += JSON.stringify(item) + ',';
			}
		}
		return ret;
	}
}
