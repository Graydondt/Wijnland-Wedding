import { Directive, ElementRef } from '@angular/core';

@Directive({
	selector: '[offsetTop]'
})
export class OffsetTopDirective {
	constructor(private _el: ElementRef) {}
	get offsetTop(): number {
		return this._el.nativeElement.offsetTop;
	}
}
