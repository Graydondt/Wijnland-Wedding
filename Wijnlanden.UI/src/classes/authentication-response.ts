import { Guest } from './guest';

export class AuthenticationResponse {
	person?: Guest;
	constructor(init?: Partial<AuthenticationResponse>) {
		if (init) {
			Object.assign(this, init);
		}
	}
}
