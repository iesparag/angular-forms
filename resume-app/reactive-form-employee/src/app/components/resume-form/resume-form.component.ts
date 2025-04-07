import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-resume-form',
  templateUrl: './resume-form.component.html',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  styleUrls: ['./resume-form.component.css']
})
export class ResumeFormComponent {
resumeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.resumeForm = this.fb.group({
      personalDetails: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        socialLinks: this.fb.array([]) // Array for social/contact links
      }),
      address: this.fb.group({ 
        houseNumber: ['', Validators.required],
        floor: ['', Validators.required],
        street: ['', Validators.required],
        city: ['', Validators.required],
        landmark: [''],
        state: ['', Validators.required],
        country: ['', Validators.required]
      }),
      education: this.fb.array([this.createEducation()]),
      experience: this.fb.array([this.createExperience()]),
      skills: this.fb.array([this.createSkill()]),
      projects: this.fb.array([this.createProject()])
    });
  }

  /** ✅ Create FormGroups for dynamic sections */
  createEducation() {
    return this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      description: ['', Validators.required]
    });
  }

  createExperience() {
    return this.fb.group({
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      yearsWorked: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  createSkill() {
    return this.fb.group({
      skillName: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  /** ✅ Projects Section */
  createProject() {
    return this.fb.group({
      projectName: ['', Validators.required],
      description: ['', Validators.required],
      techStack: this.fb.array([]), // ✅ Tech Stack as array
      role: ['', Validators.required],
      additionalInfo: this.fb.array([]) // ✅ Key-Value Format
    });
  }

  /** ✅ Create Social Link Entry */
  createSocialLink() {
    return this.fb.group({
      platform: ['', Validators.required], // e.g., 'GitHub', 'LinkedIn'
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  /** ✅ Helper Functions to Access FormArrays */
  get socialLinksArray() { return this.resumeForm.get('personalDetails.socialLinks') as FormArray; }
  get educationArray() { return this.resumeForm.get('education') as FormArray; }
  get experienceArray() { return this.resumeForm.get('experience') as FormArray; }
  get skillsArray() { return this.resumeForm.get('skills') as FormArray; }
  get projectsArray() { return this.resumeForm.get('projects') as FormArray; }

  /** ✅ Add Dynamic Sections */
  addSocialLink() { this.socialLinksArray.push(this.createSocialLink()); }
  addEducation() { this.educationArray.push(this.createEducation()); }
  addExperience() { this.experienceArray.push(this.createExperience()); }
  addSkill() { this.skillsArray.push(this.createSkill()); }
  addProject() { this.projectsArray.push(this.createProject()); }

  /** ✅ Remove Sections but keep at least one */
  removeSocialLink(index: number) { this.socialLinksArray.removeAt(index); }
  removeEducation(index: number) { if (this.educationArray.length > 1) this.educationArray.removeAt(index); }
  removeExperience(index: number) { this.experienceArray.removeAt(index); }
  removeSkill(index: number) { if (this.skillsArray.length > 1) this.skillsArray.removeAt(index); }
  removeProject(index: number) { if (this.projectsArray.length > 1) this.projectsArray.removeAt(index); }

  /** ✅ Tech Stack (Dynamic) */
  addTechStack(projectIndex: number) {
    const techStackArray = this.getTechStackArray(projectIndex);
    techStackArray.push(this.fb.control('')); 
  }

  removeTechStack(projectIndex: number, techIndex: number) {
    const techStackArray = this.getTechStackArray(projectIndex);
    if (techStackArray.length > 0) techStackArray.removeAt(techIndex);
  }

  getTechStackArray(projectIndex: number) {
    return (this.projectsArray.at(projectIndex).get('techStack') as FormArray);
  }

  /** ✅ Additional Info (Key-Value Pairs) */
  addAdditionalInfo(projectIndex: number) {
    const additionalInfoArray = this.getAdditionalInfoArray(projectIndex);
    additionalInfoArray.push(this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    }));
  }

  removeAdditionalInfo(projectIndex: number, infoIndex: number) {
    const additionalInfoArray = this.getAdditionalInfoArray(projectIndex);
    if (additionalInfoArray.length > 0) additionalInfoArray.removeAt(infoIndex);
  }

  getAdditionalInfoArray(projectIndex: number) {
    return (this.projectsArray.at(projectIndex).get('additionalInfo') as FormArray);
  }

  /** ✅ Submit Form and Display Data */
  submitForm() {
    if (this.resumeForm.valid) {
      console.log('Resume Data:', this.resumeForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
