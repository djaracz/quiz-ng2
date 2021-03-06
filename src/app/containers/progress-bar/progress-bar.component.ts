import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuizState } from '../../state/app-state';
import { Store } from '@ngrx/store';
import * as types from '../../constants/app-constants';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnDestroy {

    pctRemainingRunning: boolean;
    pctRemaining: number;
    quizStarted: boolean;
    timer: Observable<any>;
    subscription: Subscription[] = [];
    progressBarWidth: string;

    constructor(private store: Store<QuizState>) {
        this.subscription.push(store.select('quizReducer')
            .subscribe((state: QuizState) => {
                this.pctRemaining = state.pctRemaining;
                this.progressBarWidth = state.pctRemaining.toString() + '%';
                this.pctRemainingRunning = state.pctRemainingRunning;
                this.quizStarted = state.quizStarted;
            }));
    }

    ngOnInit() {
        this.store.dispatch({ type: types.SET_PCT_REMAINING });
        this.subscription.push(this.createTimer());
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe());
    }

    createTimer(): Subscription {
        this.timer = Observable.timer(100, 100);

        return this.timer.subscribe(() => {
            if (this.quizStarted) {
                if (this.pctRemaining > 0 && this.pctRemainingRunning) {
                    this.store.dispatch({ type: types.SET_PCT_REMAINING });
                } else if (this.pctRemainingRunning) {
                    this.store.dispatch({ type: types.STOP_PROGRESS_BAR });
                    this.store.dispatch({ type: types.HIGHLIGHT_CORRECT_ANSWER });
                    setTimeout(() => {
                        this.store.dispatch({ type: types.RESET_PCT_REMAINING });
                        this.store.dispatch({ type: types.NEXT_QUESTION });
                    }, 3000);
                }
            }
        });
    }
}
