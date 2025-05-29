import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-save-resume-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <h2>Save Resume</h2>
        <form [formGroup]="saveForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title">Resume Title</label>
            <input 
              type="text" 
              id="title" 
              formControlName="title" 
              placeholder="Enter a title for your resume"
              class="form-control">
            <div *ngIf="saveForm.get('title')?.touched && saveForm.get('title')?.invalid" class="error-message">
              Title is required
            </div>
          </div>
          <div class="button-group">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="saveForm.invalid">Save</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .error-message {
      color: red;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-primary {
      background: #007bff;
      color: white;
      border: none;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      border: none;
    }
  `]
})
export class SaveResumeModalComponent {
  saveForm: FormGroup;
  @Input() initialTitle: string = '';
  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {
    this.saveForm = this.fb.group({
      title: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.initialTitle) {
      this.saveForm.patchValue({ title: this.initialTitle });
    }
  }

  onSubmit() {
    if (this.saveForm.valid) {
      this.save.emit(this.saveForm.value.title);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
