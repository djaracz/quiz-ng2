import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';

@Injectable()
export class FirebaseService {

  constructor(private af: AngularFire) { }

  fetchQuestions() {
    return this.af.database.list('/questions');
  }

}
