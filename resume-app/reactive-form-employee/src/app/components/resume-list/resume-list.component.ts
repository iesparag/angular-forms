import { Component, OnInit, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-resume-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="resume-list-btn" (click)="toggleList()">
      <i class="fas fa-file-alt"></i>
      My Resumes
    </button>
    <div class="modal-overlay" *ngIf="isOpen" (click)="onOverlayClick($event)">
      <div class="modal">
        <div class="modal-header">
          <h3>Your Resumes</h3>
          <button class="close-btn" (click)="toggleList()">×</button>
        </div>
        <div class="resume-list">
          <div class="loading" *ngIf="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Loading resumes...</span>
          </div>
          <div class="error" *ngIf="error">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ error }}</span>
          </div>
          <div class="empty" *ngIf="!loading && !error && resumes.length === 0">
            <i class="fas fa-file-alt"></i>
            <span>No resumes found</span>
          </div>
          <div class="resume-pill" 
               *ngFor="let resume of resumes" 
               (click)="selectResume(resume)"
               [class.selected]="selectedResume?._id === resume._id">
            <i class="fas fa-file-alt"></i>
            {{ resume.title || 'Untitled Resume' }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .resume-list-btn {
      background: none;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 8px 12px;
      cursor: pointer;
      display: inline-block;
      align-items: center;
      gap: 8px;
      color: #333;
      transition: all 0.2s;
    }

    .resume-list-btn:hover {
      background: #f5f5f5;
      border-color: #ccc;
    }

    .resume-list-btn i {
      font-size: 16px;
    }

    :host {
      position: relative;
      display: inline-block;
    }

    .resume-list-container {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 300px;
      max-height: 400px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      z-index: 1000;
      visibility: hidden;
      opacity: 0;
      padding: 16px;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
      transition: all 0.2s;
    }

    .resume-list-container.show {
      visibility: visible;
      opacity: 1;
    }

    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.8);
      z-index: 1000;
      width: 500px;
      max-width: 90%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideIn 0.3s ease-out;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(to right, #4776E6, #8E54E9);
      border: none;
    }

    .modal-header h3 {
      color: white;
      font-size: 20px;
      font-weight: 500;
      margin: 0;
    }

    .modal-header h3 {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .resume-list-header h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }

    .close-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      backdrop-filter: blur(4px);
    }

    .close-btn:hover {
      background: #f1f5f9;
      color: #334155;
    }

    .resume-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 24px;
      max-height: 400px;
      overflow-y: auto;
      align-items: flex-start;
      align-content: flex-start;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
    }

    .resume-list::-webkit-scrollbar {
      width: 8px;
    }

    .resume-list::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    .resume-list::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .resume-list::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .loading, .error, .empty {
      padding: 40px 20px;
      text-align: center;
      color: #64748b;
      width: 100%;
      font-size: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .loading i {
      font-size: 24px;
      color: #3b82f6;
      margin-bottom: 8px;
    }

    .error i {
      font-size: 24px;
      color: #ef4444;
      margin-bottom: 8px;
    }

    .empty i {
      font-size: 24px;
      color: #94a3b8;
      margin-bottom: 8px;
    }

    .error {
      color: #e53935;
    }

    .resume-pill {
      background: linear-gradient(135deg, #f8f9ff 0%, #f1f4ff 100%);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(99, 102, 241, 0.1);
      color: #4F46E5;
      white-space: nowrap;
      margin: 2px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }

    .resume-pill i {
      font-size: 20px;
      color: #3b82f6;
      transition: all 0.2s;
    }

    .resume-pill .resume-info {
      flex: 1;
      overflow: hidden;
    }

    .resume-pill .resume-title {
      font-weight: 500;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .resume-pill .resume-date {
      font-size: 12px;
      color: #64748b;
    }

    .resume-pill.selected {
      background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }

    .resume-pill.selected::after {
      content: '✓';
      position: absolute;
      right: 12px;
      font-weight: bold;
    }

    .resume-pill i {
      color: #666;
      font-size: 14px;
    }

    .resume-pill:hover {
      background: linear-gradient(135deg, #f1f4ff 0%, #e8ebff 100%);
      border-color: rgba(99, 102, 241, 0.2);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
    }

    .resume-pill.selected:hover {
      background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
    }

    .resume-pill:active {
      transform: translateY(0);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .resume-pill.selected:hover {
      background: #0052a3;
      border-color: #003d7a;
    }

    .resume-pill.selected:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0,102,204,0.2);
    }
  `]
})
export class ResumeListComponent implements OnInit {
  resumes: any[] = [];
  isOpen = false;
  loading = false;
  error: string | null = null;
  selectedResume: any = null;

  constructor(
    private resumeService: ResumeService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.loadResumes();
  }

  loadResumes() {
    this.loading = true;
    this.error = null;
    this.resumeService.getResumes().subscribe({
      next: (data: any[]) => {
        this.resumes = data;
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Error loading resumes:', error);
        this.error = 'Failed to load resumes. Please try again.';
        this.loading = false;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleList() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.loadResumes(); // Refresh list when opening
    }
  }

  @Output() resumeSelected = new EventEmitter<any>();

  onOverlayClick(event: MouseEvent) {
    // Only close if clicking the overlay itself, not its children
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.toggleList();
    }
  }

  selectResume(resume: any) {
    this.selectedResume = resume;
    this.resumeSelected.emit(resume);
    this.toggleList();
  }
}
