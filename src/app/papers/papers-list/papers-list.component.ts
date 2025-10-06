import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PapersService } from '../services/papers.service';
import { Paper, Subject, Exam, Session } from '../../generated';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-papers-list',
  templateUrl: './papers-list.component.html',
  styleUrls: ['./papers-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterLink]
})
export class PapersListComponent implements OnInit {
  papers: Paper[] = [];
  subjects: Subject[] = [];
  exams: Exam[] = [];
  sessions: Session[] = [];
  filterForm!: FormGroup;
  isLoading = true;

  constructor(
    private papersService: PapersService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    // Initialize form
    this.filterForm = this.fb.group({
      subjectId: [0],
      examId: [0],
      sessionId: [0]
    });

    // Subscribe to filter changes first
    this.filterForm.valueChanges.subscribe(filters => {
      this.papersService.updateFilters(filters);
      this.loadPapers(filters);
    });

    // Load filter options
    await this.loadFilterOptions();

    // Get examId from route
    this.route.params.subscribe(params => {
      const examId = params['examId'];
      if (examId) {
        this.filterForm.patchValue({ examId: Number(examId) }, { emitEvent: false });
        this.loadPapers({ ...this.filterForm.value, examId: Number(examId) });
      }
    });
  }

  private async loadFilterOptions() {
    try {
      const [subjects, exams, sessions] = await Promise.all([
        this.papersService.getSubjects(),
        this.papersService.getExams(),
        this.papersService.getSessions()
      ]);

      this.subjects = subjects;
      this.exams = exams;
      this.sessions = sessions;
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  }

  private loadPapers(filters: any = {}) {
    this.isLoading = true;
    this.papersService.getPapers(filters).subscribe(
      papers => {
        this.papers = papers;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading papers:', error);
        this.isLoading = false;
      }
    );
  }

  clearFilters() {
    this.filterForm.reset();
  }

  trackByPaperId(index: number, paper: Paper): number {
    return paper.paperId || index;
  }
}
