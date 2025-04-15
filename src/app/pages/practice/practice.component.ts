import { Component, OnInit } from '@angular/core';
import { QuestionService,Question } from '../../services/question.service';
import { QuestionCardComponent } from "../../components/question-card/question-card.component";
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatToolbarModule} from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css'],
  imports: [QuestionCardComponent,CommonModule,ScrollingModule,MatToolbarModule,MatButtonToggleModule,FormsModule,MatFormFieldModule,MatSelectModule,MatIconModule],
})
export class PracticeComponent implements OnInit {
  questions: Question[] = [];
  selectedType: string = 'all';
  selectedLevel: string = 'all';
  selectedTopic: string = 'all';
  showBookmarks: boolean = false;

  allTopics: string[] = []; // populate this from your questions
  bookmarkedQuestions: any[] = [];
  filteredQuestions: any[] = [];
  showFilters: boolean = false;


  constructor(private questionService: QuestionService) {}

  ngOnInit() {
    this.questionService.getQuestions().subscribe((data: Question[]) => {
      this.questions = data;
      this.filteredQuestions = [...this.questions];
      this.populateTopics();
    });
  }

  // populateTopics() {
  //   const topics = this.questions.map(q => q.topic);
  //   this.allTopics = [...new Set(topics)].sort();
  // }

  // applyFilters() {
  //   const source = this.showBookmarks ? this.bookmarkedQuestions : this.questions;

  //   this.filteredQuestions = source.filter(q =>
  //     (this.selectedType === 'all' || q.type === this.selectedType) &&
  //     (this.selectedLevel === 'all' || q.level.toLowerCase() === this.selectedLevel) &&
  //     (this.selectedTopic === 'all' || q.topic === this.selectedTopic)
  //   );
  // }

  // Normalize topics by splitting them on '-' and considering the part before it
  normalizeTopic(topic: string): string {
    const parts = topic.split('-').map(part => part.trim());
    return parts[0].toLowerCase(); // Take only the part before '-'
  }

  populateTopics() {
    const topics: string[] = [];

    // Iterate over all questions and normalize topics
    this.questions.forEach(q => {
      const normalizedTopic = this.normalizeTopic(q.topic);
      if (!topics.includes(normalizedTopic)) {
        topics.push(normalizedTopic);
      }
    });

    // Sort the unique topics
    this.allTopics = topics.sort();
  }

  applyFilters() {
    const source = this.showBookmarks ? this.bookmarkedQuestions : this.questions;

    this.filteredQuestions = source.filter(q =>
      (this.selectedType === 'all' || q.type === this.selectedType) &&
      (this.selectedLevel === 'all' || q.level.toLowerCase() === this.selectedLevel) &&
      (this.selectedTopic === 'all' || this.normalizeTopic(q.topic) === this.selectedTopic)
    );
  }

  toggleBookmark(question: Question) {
    const isAlreadyBookmarked = this.bookmarkedQuestions.some(q => q.question === question.question);
  
    if (isAlreadyBookmarked) {
      this.bookmarkedQuestions = this.bookmarkedQuestions.filter(q => q.question !== question.question);
    } else {
      this.bookmarkedQuestions.push(question);
    }
  
    this.applyFilters();
  }
  
  isQuestionBookmarked(question: Question): boolean {
    return this.bookmarkedQuestions.some(q => q.question === question.question);
  }

  showBookmarkedQuestions() {
    this.showBookmarks = !this.showBookmarks;
    this.applyFilters();
  }

  
toggleFilters() {
  this.showFilters = !this.showFilters;
}
}
