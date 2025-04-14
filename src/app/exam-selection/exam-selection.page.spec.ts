import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamSelectionPage } from './exam-selection.page';

describe('ExamSelectionPage', () => {
  let component: ExamSelectionPage;
  let fixture: ComponentFixture<ExamSelectionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
