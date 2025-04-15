import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Question {
  topic: string;
  id: number;
  type: 'descriptive' | 'mcq';
  question: string;
  answer?: string;
  options?: string[];
  correct_answer?: string;
  level?:string
}

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>('assets/fixed_qa.json');
  }
}
