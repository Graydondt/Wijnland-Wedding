import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Guest } from 'src/classes/guest';
import { CodeService } from 'src/services/code.service';
import { FeedbackService } from 'src/services/feedback.service';
import { LoggerService } from 'src/services/logger.service';

@Component({
	selector: 'quiz-step',
	templateUrl: './quiz-step.component.html',
	styleUrls: [ './quiz-step.component.scss' ]
})
export class QuizStepComponent implements OnInit {
	@Input() guest: Guest | undefined;
	groups: IQuestion[] = [];

	constructor(
		private _authService: CodeService,
		private _router: Router,
		private _feedback: FeedbackService,
		private _logger: LoggerService
	) {}

	ngOnInit(): void {
		this.setupQuestions();
	}

	async finish() {
		await this.calculateAnswers();
		await this.save();
	}

	private setupQuestions() {
		const q1: IQuestion = {
			question: 'Where did Graydon and Cindi meet?',
			options: [ 'At church', 'A birthday party at a bar', 'Online playing games', 'On a tinder date at spur' ],
			choice: '',
			answer: 'A birthday party at a bar'
		};

		const q2: IQuestion = {
			question: 'How did Graydon ask Cindi if she was single the night he met her?',
			options: [
				'"Are you single?"',
				'"Where is your boyfriend tonight?"',
				'"Are you employed by KFC? Cause you are finger licking good"',
				'"Are you on the market?"'
			],
			choice: '',
			answer: '"Are you on the market?"'
		};

		const q3: IQuestion = {
			question: 'To what restaurant did they go for their first date?',
			options: [ 'Cappuccinos', 'Spur', 'Wimpy', 'RocoMamas' ],
			choice: '',
			answer: 'Cappuccinos'
		};

		const q4: IQuestion = {
			question: "Graydon infamously forgot Cindi's name on the first date, what did he call her?",
			options: [ 'Cindels', 'Clarissa', 'Celine', 'Clarise' ],
			choice: '',
			answer: 'Clarise'
		};

		const q5: IQuestion = {
			question: 'What nickname does Graydon and Cindi use to call each other?',
			options: [ 'Liefie', 'Babe', 'Honey', 'Tjoppels', 'Bokkie', 'Lovey', 'Bokkels', 'Honey Suckle' ],
			choice: '',
			answer: 'Bokkels'
		};

		const q6: IQuestion = {
			question: 'Why did Graydon and Cindi decide to move to Cape Town?',
			options: [
				'They wanted a more relaxed lifestyle near the ocean',
				'It is the only city where Cindi could find a job',
				'They visited Cape Town and decided they could get used to living there',
				'Cindi moved to Cape Town and Graydon had no choice but to follow her'
			],
			choice: '',
			answer: 'They visited Cape Town and decided they could get used to living there'
		};

		const q7: IQuestion = {
			question: 'What hobby does Graydon and Cindi share?',
			options: [ 'Gaming', 'Binging Netflix', 'Boardgames', 'Netball' ],
			choice: '',
			answer: 'Boardgames'
		};

		this.groups.push(q1, q2, q3, q4, q5, q6, q7);
	}

	private async calculateAnswers() {
		if (!this.guest) return;
		for (const group of this.groups) {
			if (group.choice.toLocaleLowerCase() === group.answer.toLocaleLowerCase()) {
				this.guest.quizTotal++;
			}
		}
	}

	private async save() {
		try {
			this._feedback.showLoader();
			await this._authService.saveCurrentPerson();
			this._router.navigateByUrl('/');
		} catch (error) {
			this._logger.error('Could not save Guest', 'save', error);
			this._feedback.showError();
		} finally {
			this._feedback.hideLoader();
		}
	}
}

interface IQuestion {
	question: string;
	options: string[];
	choice: string;
	answer: string;
}
