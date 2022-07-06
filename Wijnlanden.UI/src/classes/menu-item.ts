import { noop } from 'rxjs';

export class MenuItem {
	title: string = '';
	icon: string = '';
	action: () => void = noop;

	constructor(init?: Partial<MenuItem>) {
		if (init) {
			Object.assign(this, init);
		}
	}
}
