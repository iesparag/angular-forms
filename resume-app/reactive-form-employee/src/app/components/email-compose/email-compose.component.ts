import { Component, OnInit, Inject } from '@angular/core';
import { SheetService } from '../../services/sheet.service';
import { Sheet } from '../../models/sheet.model';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmailService } from '../../services/email.service';

interface Attachment {
  name: string;
  data?: string;
  type?: string;
}

@Component({
  selector: 'app-email-compose',
  standalone: true,
  imports: [CommonModule, FormsModule, JsonPipe],
  templateUrl: './email-compose.component.html',
  styleUrl: './email-compose.component.css'
})
export class EmailComposeComponent implements OnInit {
  sheets: Sheet[] = [];
  selectedSheetId: string | null = null;
  emailList: string[] = [];
  newEmail: string = '';
  emailData = {
    to: '',
    subject: 'Application for Frontend Developer Role',
    message: 'Dear HR Team,\n\nI am reaching out regarding the Frontend Developer position at your company. With my strong background in web development, I believe I would be an excellent addition to your team.',
    attachments: [] as Attachment[]
  };

  constructor(
    private sheetService: SheetService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EmailComposeComponent>,
    private emailService: EmailService
  ) {
    this.loadSheets();
  }

  ngOnInit() {
    this.loadSheets();
    // Attach PDF if provided in dialog data
    if (this.data && this.data.attachments && Array.isArray(this.data.attachments)) {
      for (const att of this.data.attachments) {
        this.emailData.attachments.push(att);
      }
    }
  }

  loadSheets() {
    this.sheetService.getSheets().subscribe(sheets => {
      this.sheets = sheets;
    });
  }

  onNativeSheetChange(event: Event) {
    debugger
    const sheetId = (event.target as HTMLSelectElement).value;
    const selectedSheet = this.sheets.find(s => s._id === sheetId);
    if (selectedSheet && selectedSheet.emails) {
      this.selectedSheetId = sheetId;
      this.emailList = selectedSheet.emails.filter(email => this.validateEmail(email));
      this.emailData.to = this.emailList.join(', ');
    } else {
      this.emailList = [];
      this.emailData.to = '';
    }
  }

  addEmail() {
    const value = this.newEmail.trim();
    if (value && this.validateEmail(value) && !this.emailList.includes(value)) {
      this.emailList.push(value);
      this.emailData.to = this.emailList.join(', ');
    }
    this.newEmail = '';
  }

  remove(email: string) {
    this.emailList = this.emailList.filter(e => e !== email);
    this.emailData.to = this.emailList.join(', ');
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  handleFiles(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'application/pdf') {
        this.emailData.attachments.push(file);
      }
    }
  }

  removeAttachment(index: number) {
    this.emailData.attachments.splice(index, 1);
  }

  onSend() {
    this.emailService.sendEmail(this.emailData).subscribe({
      next: (res) => {
        this.dialogRef.close(res);
      },
      error: (err) => {
        alert('Failed to send email.');
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
