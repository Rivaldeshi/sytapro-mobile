import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaperService, SubjectService, SessionService, ExamService, Paper, Subject, Exam, Session } from '../../generated';

@Injectable({
  providedIn: 'root'
})
export class PapersService {
  private filterSubject = new BehaviorSubject<any>({
    subjectId: null,
    examId: null,
    sessionId: null
  });

  constructor(
    private paperApi: PaperService,
    private subjectService: SubjectService,
    private sessionService: SessionService,
    private examService: ExamService
  ) {}

  getPapers(filters: any = {}): Observable<Paper[]> {
    return this.paperApi.paperControllerSearchPapersAsync(
      filters.examId,
      filters.subjectId,
      filters.sessionId
    );
  }

  getPaper(id: number): Observable<Paper> {
    return this.paperApi.paperControllerGetPaperById(id);
  }

  async getSubjects(): Promise<Subject[]> {
    return firstValueFrom(this.subjectService.subjectControllerGetAllSubjects());
  }

  async getExams(): Promise<Exam[]> {
    return firstValueFrom(this.examService.examControllerGetAllExams());
  }

  async getSessions(): Promise<Session[]> {
    return firstValueFrom(this.sessionService.sessionControllerGetAllSessions());
  }

  updateFilters(filters: any): void {
    this.filterSubject.next({ ...this.filterSubject.value, ...filters });
  }

  getFilters(): Observable<any> {
    return this.filterSubject.asObservable();
  }

  downloadPdf(fileMetadataId: number): Observable<Blob> {
    return this.paperApi.paperControllerGetPdf(fileMetadataId).pipe(
      map(response => new Blob([response], { type: 'application/pdf' }))
    );
  }

  // streamVideo(fileMetadataId: number): Observable<string> {
  //   return this.paperApi.getStreamingUrl(fileMetadataId);
  // }
}
