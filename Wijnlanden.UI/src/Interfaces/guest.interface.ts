import { Province } from 'src/classes/enums/Province';
import { Relation } from 'src/classes/enums/relation';
import { Rsvp } from 'src/classes/enums/rsvp';

export interface IGuest {
	id: string;
	name: string;
	surname: string;
	email: string;
	code: string;
	allowPlusOne: boolean;
	rsvp: Rsvp;
	sendReminder: boolean;
	addedFromRSVP: boolean;
	relation: Relation;
	province: Province;
	kids: number;
	done: boolean;
	partner?: IGuest;
	canapes: string[];
	mains: string[];
	sides: string[];
	desserts: string[];
	quizTotal: number;
}
