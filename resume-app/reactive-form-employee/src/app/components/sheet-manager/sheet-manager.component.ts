import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { SheetService } from '../../services/sheet.service';
import { Sheet } from '../../models/sheet.model';

@Component({
  selector: 'app-sheet-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './sheet-manager.component.html',
  styleUrls: ['./sheet-manager.component.scss']
})
export class SheetManagerComponent implements OnInit {
  sheets: Sheet[] = [];
  sheetForm: FormGroup;
  editMode = false;
  currentSheetId: string | null = null;
  loading = false;
  emailList: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private sheetService: SheetService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.sheetForm = this.fb.group({
      name: ['', Validators.required],
      emails: [''],
      emailsValid: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.loadSheets();
  }

  loadSheets(): void {
    this.loading = true;
    this.sheetService.getSheets().subscribe({
      next: (sheets) => {
        console.log('Loaded sheets:', sheets);
        this.sheets = sheets;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading sheets:', error);
        this.loading = false;
        this.showSnackBar('Failed to load sheets. Please try again.');
      }
    });
  }

  onSubmit(): void {
    console.log('Form submitted', this.sheetForm.value);
    
    if (this.sheetForm.invalid) {
      this.showSnackBar('Please fill all required fields');
      return;
    }

    const { name, emails } = this.sheetForm.value;
    let emailsToSave = this.emailList;
    
    // If user entered emails in the input field as well, add them to the list
    if (emails && emails.trim()) {
      const newEmails = emails.split(',').map((email: string) => email.trim());
      emailsToSave = [...emailsToSave, ...newEmails.filter((email: string) => email !== '')];
    }
    
    console.log('Saving emails:', emailsToSave);
    this.loading = true;

    if (this.editMode && this.currentSheetId) {
      this.sheetService.updateSheet(this.currentSheetId, { name, emails: emailsToSave }).subscribe({
        next: (sheet) => {
          console.log('Sheet updated:', sheet);
          this.loading = false;
          this.loadSheets();
          this.resetForm();
          this.showSnackBar('Sheet updated successfully');
        },
        error: (error) => {
          console.error('Error updating sheet:', error);
          this.loading = false;
          this.showSnackBar('Failed to update sheet. Please try again.');
        }
      });
    } else {
      this.sheetService.createSheet(name, emailsToSave).subscribe({
        next: (sheet) => {
          console.log('Sheet created:', sheet);
          this.loading = false;
          this.loadSheets();
          this.resetForm();
          this.showSnackBar('Sheet created successfully');
        },
        error: (error) => {
          console.error('Error creating sheet:', error);
          this.loading = false;
          this.showSnackBar('Failed to create sheet. Please try again.');
        }
      });
    }
  }

  editSheet(sheet: Sheet): void {
    this.currentSheetId = sheet.id;
    this.editMode = true;
    this.sheetForm.patchValue({
      name: sheet.name,
      emails: '',
      emailsValid: true
    });
    this.emailList = [...sheet.emails];
  }

  deleteSheet(id: string): void {
    if (confirm('Are you sure you want to delete this sheet?')) {
      this.loading = true;
      this.sheetService.deleteSheet(id).subscribe({
        next: () => {
          this.loading = false;
          this.loadSheets();
          this.showSnackBar('Sheet deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting sheet:', error);
          this.loading = false;
          this.showSnackBar('Failed to delete sheet. Please try again.');
        }
      });
    }
  }

  resetForm(): void {
    this.sheetForm.reset({ name: '', emails: '', emailsValid: false });
    this.editMode = false;
    this.currentSheetId = null;
    this.emailList = [];
  }
  
  addEmail(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    
    // Add email(s)
    if (value.trim()) {
      // Split by comma to handle pasted lists of emails
      const emails = value.trim().split(',');
      
      // Add each email as a separate chip
      emails.forEach((email: string) => {
        if (email.trim()) {
          this.emailList.push(email.trim());
        }
      });
      
      // Update form validation
      this.sheetForm.get('emailsValid')?.setValue(this.emailList.length > 0);
    }
    
    // Reset the input value
    if (input) {
      input.value = '';
    }
    
    this.sheetForm.get('emails')?.setValue('');
  }
  
  removeEmail(email: string): void {
    const index = this.emailList.indexOf(email);
    if (index >= 0) {
      this.emailList.splice(index, 1);
      
      // Update form validation
      this.sheetForm.get('emailsValid')?.setValue(this.emailList.length > 0);
    }
  }
  
  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
