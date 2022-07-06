import { IGuest } from 'src/Interfaces/guest.interface';

import { Province } from './enums/Province';
import { Relation } from './enums/relation';
import { Rsvp } from './enums/rsvp';
import { Guid } from './guid';

export class Guest implements IGuest {
	id = Guid.newGuid();
	name = '';
	surname = '';
	email = ''; //TODO: Make sure you dont send this back to front end
	code = '';
	allowPlusOne = false;
	rsvp = Rsvp.Unknown;
	sendReminder = false;
	addedFromRSVP = false;
	relation = Relation.Unknown;
	province = Province.Unknown;
	kids = 0;
	done = false;
	partner?: Guest;
	canapes: string[] = [];
	mains: string[] = [];
	sides: string[] = [];
	desserts: string[] = [];
	quizTotal: number = 0;

	constructor(init?: Partial<Guest>) {
		if (init) {
			Object.assign(this, init);
		}
	}
}
