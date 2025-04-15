import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../services/question.service';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-question-card',
  imports: [CommonModule,MatCardModule,MatListModule,MatIconModule,MatRadioModule,FormsModule],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.css'
})
export class QuestionCardComponent {
  @Input() question!: Question;
  @Input() isBookmarked: boolean = false;
  @Output() bookmarkToggle = new EventEmitter<Question>();
  selectedOption: string = '';  // stores the selected option
  isCorrect: boolean = false;  // stores if selected answer is correct

  ngOnInit(): void {
    this.isBookmarked = this.checkIfBookmarked();
  }
    // Check if the selected option is correct
    checkAnswer() {
      this.isCorrect = this.selectedOption === this.question.correct_answer;
    }
  toggleBookmark() {
    this.bookmarkToggle.emit(this.question);
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

    if (this.isBookmarked) {
      // remove
      bookmarks = bookmarks.filter((id: number) => id !== this.question.id);
    } else {
      // add
      bookmarks.push(this.question.id);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    this.isBookmarked = !this.isBookmarked;
  }

  checkIfBookmarked(): boolean {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    return bookmarks.includes(this.question.id);
  }
}
