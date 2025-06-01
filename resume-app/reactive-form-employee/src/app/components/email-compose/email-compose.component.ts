import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-email-compose',
  templateUrl: './email-compose.component.html',
  styleUrls: ['./email-compose.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ]
})
export class EmailComposeComponent {
  emailData = {
    to: '',
    subject: 'Resume Application',
    message: '',
    attachments: [] as File[]
  };

  constructor(
    public dialogRef: MatDialogRef<EmailComposeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data?.resumeData) {
      // Pre-fill message with resume data if provided
      this.emailData.message = this.generateEmailContent(data.resumeData);
    }
  }

  private generateEmailContent(resumeData: any): string {
    return `Dear Hiring Manager,

I am writing to express my interest in potential opportunities at your organization. Please find my resume attached.

Best regards,
${resumeData?.personalDetails?.name || ''}`;
  }

  onSend(): void {
    // TODO: Implement email sending logic
    this.dialogRef.close(this.emailData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAttachFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      this.emailData.attachments = [...this.emailData.attachments, ...Array.from(files)];
    }
  }

  removeAttachment(index: number): void {
    this.emailData.attachments.splice(index, 1);
  }
}
