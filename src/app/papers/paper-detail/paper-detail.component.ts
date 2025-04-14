import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PapersService } from '../services/papers.service';
import { Paper } from '../../generated';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, PdfViewerModule]
})
export class PaperDetailComponent implements OnInit {
  paper: Paper | null = null;
  pdfUrl: string | null = null;
  videoUrl: string | null = null;
  isLoading = true;
  activeTab: 'question' | 'solution' | 'video' = 'question';
  onPdfLoadComplete(pdf: any) {
    console.log('PDF loaded successfully', pdf);
  }

  onPdfLoadError(error: any) {
    console.error('Error loading PDF:', error);
    this.showErrorToast('Error loading PDF');
  }

  constructor(
    private route: ActivatedRoute,
    private papersService: PapersService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const paperId = this.route.snapshot.params['id'];
    this.loadPaper(paperId);
  }

  private loadPaper(id: number) {
    this.isLoading = true;
    this.papersService.getPaper(id).subscribe(
      paper => {
        this.paper = paper;
        if (paper.fileMetadata?.id) {
          this.loadQuestionPdf(paper.fileMetadata.id);
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error loading paper:', error);
        this.isLoading = false;
        this.showErrorToast('Failed to load paper details');
      }
    );
  }

  loadQuestionPdf(fileMetadataId: number) {
    this.papersService.downloadPdf(fileMetadataId).subscribe(
      blob => {
        this.pdfUrl = URL.createObjectURL(blob);
      },
      error => {
        console.error('Error loading PDF:', error);
        this.showErrorToast('Failed to load PDF');
      }
    );
  }

  loadSolutionPdf(fileMetadataId: number) {
    this.papersService.downloadPdf(fileMetadataId).subscribe(
      blob => {
        this.pdfUrl = URL.createObjectURL(blob);
      },
      error => {
        console.error('Error loading solution PDF:', error);
        this.showErrorToast('Failed to load solution PDF');
      }
    );
  }

  // loadVideo(fileMetadataId: number) {
  //   this.papersService.streamVideo(fileMetadataId).subscribe(
  //     url => {
  //       this.videoUrl = url;
  //     },
  //     error => {
  //       console.error('Error loading video:', error);
  //       this.showErrorToast('Failed to load video solution');
  //     }
  //   );
  //}

  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }

  onTabChange(event: Event) {
    const customEvent = event as CustomEvent;
    const tab = customEvent.detail.value as 'question' | 'solution' | 'video';
    this.activeTab = tab;
    if (tab === 'solution' && this.paper?.solution?.id) {
      this.loadSolutionPdf(this.paper.solution.id);
    } else if (tab === 'video' && this.paper?.videoSolution?.id) {
      //this.loadVideo(this.paper.videoSolution.id);
    }
  }
}
