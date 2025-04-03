import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent {
employeeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(18)]],
      
      // Dynamic FormArray
      skills: this.fb.array([]),
      projects: this.fb.array([]),
    });
  }

  // Getters for FormArray
  get skills(): FormArray {
    return this.employeeForm.get('skills') as FormArray;
  }

  get projects(): FormArray {
    return this.employeeForm.get('projects') as FormArray;
  }

  // Function to add a skill
  addSkill() {
    this.skills.push(this.fb.control('', Validators.required));
  }

  // Function to remove a skill
  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  // Function to add a project
  addProject() {
    this.projects.push(
      this.fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required]
      })
    );
  }

  // Function to remove a project
  removeProject(index: number) {
    this.projects.removeAt(index);
  }

  // Submit the form
  submitForm() {
    if (this.employeeForm.valid) {
      console.log(this.employeeForm.value);
      alert('Form Submitted!');
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
}
