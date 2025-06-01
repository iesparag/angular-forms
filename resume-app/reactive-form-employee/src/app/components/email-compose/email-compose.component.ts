import { Component, Inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatChipEditedEvent, MatChipGrid } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Attachment {
  name: string;
  data: string;
  type: string;
}

@Component({
  selector: 'app-email-compose',
  templateUrl: './email-compose.component.html',
  styleUrls: ['./email-compose.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    HttpClientModule,
    MatProgressSpinnerModule
  ]
})
export class EmailComposeComponent implements OnDestroy {
  emailData = {
    subject: '',
    message: '',
    attachments: [] as Attachment[]
  }

  emailCtrl = new FormControl('');
  emailList: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('chipList') chipList!: MatChipGrid;

  isSending = false;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && this.validateEmail(value)) {
      this.emailList.push(value);
    }
    event.chipInput!.clear();
  }

  remove(email: string): void {
    const index = this.emailList.indexOf(email);
    if (index >= 0) {
      this.emailList.splice(index, 1);
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  constructor(
    public dialogRef: MatDialogRef<EmailComposeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    if (data?.resumeData) {
      // Pre-fill message with resume data if provided
      this.emailData.message = this.generateEmailContent(data.resumeData);
    }
    if (data?.attachments) {
      // Process attachments from dialog data
      this.processAttachments(data.attachments);
    }
    // Generate random message components
    const subject = this.subjectTemplates[Math.floor(Math.random() * this.subjectTemplates.length)];
    const greeting = this.greetings[Math.floor(Math.random() * this.greetings.length)];
    const opening = this.openings[Math.floor(Math.random() * this.openings.length)];
    const highlight = this.highlights[Math.floor(Math.random() * this.highlights.length)];
    const closing = this.closings[Math.floor(Math.random() * this.closings.length)];
    const signature = this.signatures[Math.floor(Math.random() * this.signatures.length)];

    // Combine message components
    this.emailData.subject = subject;
    this.emailData.message = `${greeting},

${opening}

${highlight}

${closing}${signature}`;
  }

  private subjectTemplates = [
    'Application for Senior Frontend Developer Position',
    'Senior Frontend Developer - Experienced Angular/React Developer',
    'Full Stack Developer Application with Frontend Expertise',
    'Senior Software Engineer Application - Frontend Focused',
    'Application for Frontend Development Role'
  ];

  private greetings = [
    'Dear Hiring Manager',
    'Dear Recruitment Team',
    'Dear HR Team',
    'Hello',
    'Dear Sir/Madam'
  ];

  private openings = [
    'I hope this email finds you well. I am writing to express my strong interest in the Senior Frontend Developer position at your esteemed organization.',
    'I am excited to submit my application for the Senior Frontend Developer role. With my experience in building modern web applications, I am confident in my ability to contribute to your team\'s success.',
    'I am writing to express my keen interest in joining your organization as a Senior Frontend Developer. Your company\'s reputation for technical excellence strongly resonates with my career aspirations.',
    'I am reaching out regarding the Frontend Developer position at your company. With my strong background in web development, I believe I would be an excellent addition to your team.'
  ];

  private highlights = [
    `My attached resume highlights my key qualifications:
- Over 5 years of experience in full-stack development
- Expertise in Angular, React, and Node.js
- Leadership experience in development teams
- Strong focus on code quality and performance`,

    `As detailed in my attached resume, I bring:
- Proven experience in modern web development
- Strong expertise in frontend frameworks
- Track record of improving application performance
- Experience in leading development teams`,

    `Key achievements from my attached resume:
- Led teams in delivering complex web applications
- Implemented CI/CD pipelines for faster deployment
- Reduced application load times by 40%
- Built scalable and maintainable codebases`
  ];

  private closings = [
    'I would welcome the opportunity to discuss how my skills and experience align with your team\'s needs.',
    'I am excited about the possibility of contributing to your organization and would appreciate the opportunity to discuss this role further.',
    'I would be grateful for the opportunity to further discuss how my background would be relevant to your organization.',
    'I look forward to the possibility of discussing how I can contribute to your team\'s success.'
  ];

  private signatures = [
    '\n\nThank you for considering my application.\n\nBest regards,\n[Your name]',
    '\n\nThank you for your time and consideration.\n\nKind regards,\n[Your name]',
    '\n\nI appreciate your consideration.\n\nSincerely,\n[Your name]'
  ];

  private generateEmailContent(resumeData: any): string {
    return `Dear Hiring Manager,

I am writing to express my interest in potential opportunities at your organization. Please find my resume attached.

Best regards,
${resumeData?.personalDetails?.name || ''}`;
  }

  validateEmails(emails: string): string[] {
    return emails.split(/[,;\s]+/).filter(email => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
    });
  }

  async onSend() {
    if (this.isSending || !this.emailList.length) return;
    this.isSending = true;

    try {
      // Send all emails in a single API call
      const result = await this.sendEmails();
      
      if (result.success) {
        const successCount = result.sentCount || this.emailList.length;
        this.snackBar.open(`Sent ${successCount} out of ${this.emailList.length} emails successfully`, 'Close', { duration: 5000 });
        this.dialogRef.close();
      } else {
        throw new Error(result.message || 'Failed to send emails');
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      this.snackBar.open('Error sending emails', 'Close', { duration: 3000 });
    } finally {
      this.isSending = false;
    }
  }

  private readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 60MB in bytes

  private async processAttachments(attachments: any[]): Promise<void> {
    if (!attachments || !Array.isArray(attachments)) return;

    for (const attachment of attachments) {
      if (attachment && attachment.name && attachment.data && attachment.type) {
        console.log('Processing attachment:', {
          name: attachment.name,
          type: attachment.type,
          dataSize: (attachment.data.length * 0.75) / (1024 * 1024), // Size in MB
          isDataUri: attachment.data.startsWith('data:')
        });

        this.emailData.attachments.push({
          name: attachment.name,
          data: attachment.data,
          type: attachment.type
        });
      } else if (attachment.content) {
        // If it's HTML content from resume
        const element = document.createElement('div');
        element.innerHTML = attachment.content;
        document.body.appendChild(element);

        // Apply same styling as resume-editor
        element.style.width = '210mm';
        element.style.padding = '10mm';
        element.style.backgroundColor = '#FFFFFF';
        element.style.color = '#000000';
        element.style.fontSize = '14px';
        element.style.lineHeight = '1.4';

        // Apply styles for crisp text
        const allText = element.getElementsByTagName('*');
        for (let i = 0; i < allText.length; i++) {
          const el = allText[i] as HTMLElement;
          el.style.color = '#000000';
          if (el.classList.contains('section-heading')) {
            el.style.color = '#000000';
            el.style.borderBottom = '1px solid #000000';
          }
        }

        // Let the element render
        await new Promise(resolve => setTimeout(resolve, 100));
        const contentHeight = element.scrollHeight;

        // Calculate PDF dimensions
        const pdfWidth = 210; // A4 width in mm
        const contentWidthMM = pdfWidth - 20; // 10mm padding on each side
        const scaleFactor = contentWidthMM / (element.offsetWidth - 20); // Account for padding
        const pdfHeight = (contentHeight * scaleFactor) + 20; // Add padding

        // Create PDF with custom height
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [pdfWidth, pdfHeight]
        });

        // Capture the content with same settings as resume-editor
        const canvas = await html2canvas(element, {
          // @ts-ignore - scale is a valid option in html2canvas
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#FFFFFF',
          width: element.offsetWidth,
          height: contentHeight,
          windowWidth: element.offsetWidth,
          windowHeight: contentHeight,
          logging: false,
          imageTimeout: 0,
          removeContainer: true
        });

        // Add image to PDF with compression
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        pdf.addImage(
          imageData,
          'JPEG',
          0,
          0,
          pdfWidth,
          pdfHeight,
          '',
          'FAST'
        );

        // Add clickable links
        const links = element.querySelectorAll('a');
        links.forEach((link: HTMLAnchorElement) => {
          const rect = link.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          
          const x = (rect.left - elementRect.left) * (pdfWidth / elementRect.width);
          const y = (rect.top - elementRect.top) * (pdfHeight / elementRect.height);
          const width = rect.width * (pdfWidth / elementRect.width);
          const height = rect.height * (pdfHeight / elementRect.height);

          pdf.link(x, y, width, height, { url: link.href });
        });

        // Get PDF data directly as base64 string
        const pdfOutput = pdf.output('datauristring');
        
        // Add to attachments
        this.emailData.attachments.push({
          name: attachment.name || 'resume.pdf',
          data: pdfOutput,
          type: 'application/pdf'
        });

        // Clean up
        document.body.removeChild(element);
      } else if (attachment.data) {
        // If it's an uploaded file
        this.emailData.attachments.push(attachment);
      }
    }
  }

  private async sendEmails(): Promise<any> {
    try {
      const formData = new FormData();
      
      // Add email metadata - now sending all emails in one go
      formData.append('to', this.emailList.join(','));
      formData.append('subject', this.emailData.subject);
      formData.append('message', this.emailData.message);
      formData.append('bulk', 'true');

      // Handle attachments
      for (const attachment of this.emailData.attachments) {
        if (!attachment.data.startsWith('data:')) {
          console.error('Invalid attachment data:', {
            name: attachment.name,
            type: attachment.type
          });
          throw new Error(`Invalid attachment data format for ${attachment.name}`);
        }

        // Convert data URI to blob for FormData
        const base64Data = attachment.data.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteArray = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: attachment.type });
        formData.append('attachments', blob, attachment.name);
      }

      // Log form data for debugging
      console.log('Sending bulk email:', {
        recipients: this.emailList.length,
        subject: this.emailData.subject,
      });

      // Send request
      const response = await firstValueFrom(this.http.post<any>(
        'http://localhost:5000/api/email/send-email',
        formData,
        {
          headers: { Accept: 'application/json' }
        }
      ));

      // Handle response
      if (response.success) {
        return {
          success: true,
          sentCount: response.sentCount,
          message: response.failedCount > 0 
            ? `Successfully sent ${response.sentCount} out of ${this.emailList.length} emails. ${response.failedCount} failed.`
            : `Successfully sent ${response.sentCount} emails`
        };
      }
      
      throw new Error(response.message || 'Failed to send emails');
    } catch (error: any) {
      console.error('Error details:', error);
      
      // Handle specific error cases
      if (error.error?.message) {
        throw new Error(error.error.message);
      } else if (error.message) {
        throw new Error(error.message);
      }
      
      // Generic error
      throw new Error('Failed to send emails');
    }
  }

  private showSuccessNotification(email: string, current: number, total: number) {
    this.snackBar.open(
      `Email sent to ${email}`,
      'Close',
      { duration: 3000 }
    );
  }

  private showErrorNotification(email: string) {
    this.snackBar.open(
      `Failed to send email to ${email}`,
      'Close',
      { duration: 3000 }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  async handleFiles(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files) return;

    try {
      let totalSize = 0;
      // Process files one at a time
      for (const file of Array.from(files)) {
        totalSize += file.size;
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        console.log(`Processing file: ${file.name}, Size: ${sizeMB}MB`);
        
        // Check file size before reading
        if (file.size > this.MAX_FILE_SIZE) {
          this.snackBar.open(`File ${file.name} is too large. Maximum size is 100MB.`, 'Close', { duration: 5000 });
          continue;
        }

        // Warn if total size is approaching Gmail's limit
        if (totalSize > 20 * 1024 * 1024) {
          this.snackBar.open('Warning: Total attachment size is approaching Gmail\'s 25MB limit', 'Close', { duration: 5000 });
        }

        // Read the file
        const data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });

        // Add to attachments
        const attachment = {
          name: file.name,
          data: data,
          type: file.type
        };
        this.emailData.attachments = [...this.emailData.attachments, attachment];
        console.log('Added attachment:', attachment.name, 'Type:', attachment.type);
      }
    } catch (error) {
      console.error('Error handling files:', error);
      this.snackBar.open('Error processing files', 'Close', { duration: 3000 });
    }
  }

  removeAttachment(index: number): void {
    const attachment = this.emailData.attachments[index];
    if (attachment && attachment.data.startsWith('blob:')) {
      URL.revokeObjectURL(attachment.data);
    }
    this.emailData.attachments = this.emailData.attachments.filter((_, i) => i !== index);
  }

  ngOnDestroy(): void {
    // Clean up blob URLs
    this.emailData.attachments.forEach(attachment => {
      if (attachment.data.startsWith('blob:')) {
        URL.revokeObjectURL(attachment.data);
      }
    });
  }

  previewAttachment(attachment: { name: string; data: string; type: string }): void {
    if (attachment.type === 'application/pdf' && attachment.data.startsWith('data:')) {
      // Open PDF in new tab
      window.open(attachment.data, '_blank');
    }
  }
}
