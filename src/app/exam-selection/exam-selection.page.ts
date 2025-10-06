import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PapersService } from '../papers/services/papers.service';
import { Exam } from '../generated';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';



@Component({
  selector: 'app-exam-selection',
  templateUrl: './exam-selection.page.html',
  styleUrls: ['./exam-selection.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ExamSelectionPage implements OnInit {
  exams: Exam[] = [];
  selectedExam: Exam | null = null;
  isLoading = true;

  constructor(
    private router: Router,
    private papersService: PapersService
  ) {}

  async ngOnInit() {
    try {
      this.exams = await this.papersService.getExams();
    } catch (error) {
      console.error('Error loading exams:', error);
    } finally {
      this.isLoading = false;
    }
  }

  selectExam(exam: Exam) {
    this.selectedExam = exam;
    this.viewPapers()
  }

  viewPapers() {
    if (this.selectedExam) {
      this.router.navigate(['/papers', this.selectedExam.examId]);
    }
  }
}
