import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModernTemplateComponent } from '../resume-templates/modern-template/modern-template.component';
import { MinimalTemplateComponent } from '../resume-templates/minimal-template/minimal-template.component';
import { CreativeTemplateComponent } from '../resume-templates/creative-template/creative-template.component';
import { ProfessionalTemplateComponent } from '../resume-templates/professional-template/professional-template.component';

@Component({
  selector: 'app-resume-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ModernTemplateComponent,
    MinimalTemplateComponent,
    CreativeTemplateComponent,
    ProfessionalTemplateComponent
  ],
  templateUrl: './resume-editor.component.html',
  styleUrls: ['./resume-editor.component.css']
})
export class ResumeEditorComponent implements OnInit {
  @ViewChild('previewContainer') previewContainer!: ElementRef;
  templateType: string = 'modern';
  resumeForm: FormGroup;
  resumeData: any = {};
  activeSection: string = 'personalDetails';
  isGeneratingPdf: boolean = false;
  
  // Track section visibility
  sectionVisibility: { [key: string]: boolean } = {
    professionalSummary: true,
    personalDetails: true,
    address: true,
    education: true,
    experience: true,
    skills: true,
    projects: true
  };
  
  // Sections for the form
  sections = [
    { id: 'professionalSummary', name: 'Professional Summary' },
    { id: 'personalDetails', name: 'Personal Details' },
    { id: 'address', name: 'Address' },
    { id: 'education', name: 'Education' },
    { id: 'experience', name: 'Experience' },
    { id: 'skills', name: 'Skills' },
    { id: 'projects', name: 'Projects' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resumeForm = this.createResumeForm();
  }

  ngOnInit() {
    // Get template type from route parameter
    this.route.paramMap.subscribe(params => {
      const type = params.get('type');
      if (type && ['modern', 'minimal', 'creative', 'professional'].includes(type)) {
        this.templateType = type;
      }
    });

    // Load sample data
    this.loadSampleData();
    
    // Initialize resume data
    this.updateResumeData();
  }
  
  // Load sample data to pre-fill the form
  loadSampleData() {
    const sampleData = {
      professionalSummary: 'Experienced software developer with 5+ years of expertise in full-stack development, specializing in Angular, React, and Node.js. Passionate about creating user-friendly applications with clean, maintainable code. Strong problem-solving skills and a track record of delivering projects on time.',
      personalDetails: {
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '1234567890',
        socialLinks: [
          { platform: 'LinkedIn', url: 'linkedin.com/in/alexjohnson' },
          { platform: 'GitHub', url: 'github.com/alexjohnson' },
          { platform: 'Portfolio', url: 'alexjohnson.dev' }
        ]
      },
      address: {
        houseNumber: '123',
        street: 'Tech Avenue',
        city: 'San Francisco',
        state: 'California',
        country: 'USA'
      },
      education: [
        {
          degree: 'Master of Computer Science',
          institution: 'Stanford University',
          year: '2018-2020',
          description: 'Coursework: Data Structures, Algorithms, Computer Systems, and Web Development.'
        },
        {
          degree: 'Bachelor of Science in Software Engineering',
          institution: 'University of California',
          year: '2014-2018',
          description: 'Coursework: Data Structures, Algorithms, Computer Systems, and Web Development.'
        }
      ],
      experience: [
        {
          jobTitle: 'Senior Frontend Developer',
          company: 'TechCorp Inc.',
          yearsWorked: 'Jan 2021 - Present',
          description: 'Lead a team of 5 developers in building modern web applications using Angular and React. Implemented CI/CD pipelines and improved application performance by 40%.'
        },
        {
          jobTitle: 'Full Stack Developer',
          company: 'InnovateSoft',
          yearsWorked: 'Jun 2018 - Dec 2020',
          description: 'Developed and maintained multiple web applications using MEAN stack. Collaborated with design team to implement responsive UI/UX designs.'
        }
      ],
      skills: [
        {
          skillName: 'Angular',
          skillLevel: 9,
          description: 'Expert in Angular framework with experience in Angular 8-15.'
        },
        {
          skillName: 'React',
          skillLevel: 8,
          description: 'Proficient in React, Redux, and React Hooks.'
        },
        {
          skillName: 'Node.js',
          skillLevel: 8,
          description: 'Experienced in building RESTful APIs and microservices.'
        },
        {
          skillName: 'TypeScript',
          skillLevel: 9,
          description: 'Strong typing skills and advanced TypeScript patterns.'
        },
        {
          skillName: 'MongoDB',
          skillLevel: 7,
          description: 'Database design and optimization.'
        }
      ],
      projects: [
        {
          projectName: 'E-commerce Platform',
          role: 'Lead Developer',
          description: 'Built a full-featured e-commerce platform with Angular frontend and Node.js backend. Implemented payment processing, inventory management, and user authentication.',
          techStack: ['Angular', 'Node.js', 'Express', 'MongoDB', 'Stripe API'],
          additionalInfo: [
            { key: 'GitHub', value: 'github.com/alexjohnson/ecommerce' },
            { key: 'Live Demo', value: 'ecommerce-demo.alexjohnson.dev' }
          ]
        },
        {
          projectName: 'Task Management App',
          role: 'Full Stack Developer',
          description: 'Developed a collaborative task management application with real-time updates using Socket.io. Features include task assignment, progress tracking, and deadline notifications.',
          techStack: ['React', 'Redux', 'Express', 'MongoDB', 'Socket.io'],
          additionalInfo: [
            { key: 'GitHub', value: 'github.com/alexjohnson/taskmanager' }
          ]
        }
      ]
    };
    
    // Patch the form with sample data
    this.resumeForm.patchValue({
      professionalSummary: sampleData.professionalSummary,
      personalDetails: {
        name: sampleData.personalDetails.name,
        email: sampleData.personalDetails.email,
        phone: sampleData.personalDetails.phone
      },
      address: sampleData.address
    });
    
    // Clear existing arrays
    this.socialLinksArray.clear();
    this.educationArray.clear();
    this.experienceArray.clear();
    this.skillsArray.clear();
    this.projectsArray.clear();
    
    // Add social links
    sampleData.personalDetails.socialLinks.forEach(link => {
      const socialLink = this.createSocialLink();
      socialLink.patchValue({
        platform: link.platform,
        url: link.url
      });
      this.socialLinksArray.push(socialLink);
    });
    
    // Add education items
    sampleData.education.forEach(edu => {
      const education = this.createEducation();
      education.patchValue({
        degree: edu.degree,
        institution: edu.institution,
        year: edu.year,
        description: edu.description
      });
      this.educationArray.push(education);
    });
    
    // Add experience items
    sampleData.experience.forEach(exp => {
      const experience = this.createExperience();
      experience.patchValue({
        jobTitle: exp.jobTitle,
        company: exp.company,
        yearsWorked: exp.yearsWorked,
        description: exp.description
      });
      this.experienceArray.push(experience);
    });
    
    // Add skills
    sampleData.skills.forEach(skill => {
      const skillGroup = this.createSkill();
      skillGroup.patchValue({
        skillName: skill.skillName,
        skillLevel: skill.skillLevel,
        description: skill.description
      });
      this.skillsArray.push(skillGroup);
    });
    
    // Add projects
    sampleData.projects.forEach(project => {
      const projectGroup = this.createProject();
      projectGroup.patchValue({
        projectName: project.projectName,
        role: project.role,
        description: project.description
      });
      
      // Add tech stack
      const techStackArray = projectGroup.get('techStack') as FormArray;
      techStackArray.clear(); // Clear any default items
      project.techStack.forEach(tech => {
        techStackArray.push(this.fb.control(tech));
      });
      
      // Add additional info
      const additionalInfoArray = projectGroup.get('additionalInfo') as FormArray;
      additionalInfoArray.clear(); // Clear any default items
      project.additionalInfo.forEach(info => {
        additionalInfoArray.push(this.fb.group({
          key: info.key,
          value: info.value
        }));
      });
      
      this.projectsArray.push(projectGroup);
    });
  }

  createResumeForm(): FormGroup {
    return this.fb.group({
      professionalSummary: ['', Validators.required],
      personalDetails: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        socialLinks: this.fb.array([]) // Array for social/contact links
      }),
      address: this.fb.group({ 
        houseNumber: ['', Validators.required],
        floor: [''],
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

  // Helper methods to create form groups
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
      description: ['', Validators.required],
      skillLevel: [7, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  createProject() {
    return this.fb.group({
      projectName: ['', Validators.required],
      description: ['', Validators.required],
      techStack: this.fb.array([]), // Tech Stack as array
      role: ['', Validators.required],
      additionalInfo: this.fb.array([]) // Key-Value Format
    });
  }

  createSocialLink() {
    return this.fb.group({
      platform: ['', Validators.required], // e.g., 'GitHub', 'LinkedIn'
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  // Helper getters for form arrays
  get socialLinksArray() { return this.resumeForm.get('personalDetails.socialLinks') as FormArray; }
  get educationArray() { return this.resumeForm.get('education') as FormArray; }
  get experienceArray() { return this.resumeForm.get('experience') as FormArray; }
  get skillsArray() { return this.resumeForm.get('skills') as FormArray; }
  get projectsArray() { return this.resumeForm.get('projects') as FormArray; }

  // Add methods for dynamic arrays
  addSocialLink() { this.socialLinksArray.push(this.createSocialLink()); this.updateResumeData(); }
  addEducation() { this.educationArray.push(this.createEducation()); this.updateResumeData(); }
  addExperience() { this.experienceArray.push(this.createExperience()); this.updateResumeData(); }
  addSkill() { this.skillsArray.push(this.createSkill()); this.updateResumeData(); }
  addProject() { this.projectsArray.push(this.createProject()); this.updateResumeData(); }

  // Remove methods for dynamic arrays
  removeSocialLink(index: number) { this.socialLinksArray.removeAt(index); this.updateResumeData(); }
  removeEducation(index: number) { if (this.educationArray.length > 1) { this.educationArray.removeAt(index); this.updateResumeData(); } }
  removeExperience(index: number) { if (this.experienceArray.length > 1) { this.experienceArray.removeAt(index); this.updateResumeData(); } }
  removeSkill(index: number) { if (this.skillsArray.length > 1) { this.skillsArray.removeAt(index); this.updateResumeData(); } }
  removeProject(index: number) { if (this.projectsArray.length > 1) { this.projectsArray.removeAt(index); this.updateResumeData(); } }

  // Tech stack methods
  getTechStackArray(projectIndex: number) {
    return (this.projectsArray.at(projectIndex).get('techStack') as FormArray);
  }

  addTechStack(projectIndex: number) {
    const techStackArray = this.getTechStackArray(projectIndex);
    techStackArray.push(this.fb.control('')); 
    this.updateResumeData();
  }

  removeTechStack(projectIndex: number, techIndex: number) {
    const techStackArray = this.getTechStackArray(projectIndex);
    if (techStackArray.length > 0) {
      techStackArray.removeAt(techIndex);
      this.updateResumeData();
    }
  }

  // Additional info methods
  getAdditionalInfoArray(projectIndex: number) {
    return (this.projectsArray.at(projectIndex).get('additionalInfo') as FormArray);
  }

  addAdditionalInfo(projectIndex: number) {
    const additionalInfoArray = this.getAdditionalInfoArray(projectIndex);
    additionalInfoArray.push(this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    }));
    this.updateResumeData();
  }

  removeAdditionalInfo(projectIndex: number, infoIndex: number) {
    const additionalInfoArray = this.getAdditionalInfoArray(projectIndex);
    if (additionalInfoArray.length > 0) {
      additionalInfoArray.removeAt(infoIndex);
      this.updateResumeData();
    }
  }

  // Update resume data from form
  updateResumeData() {
    this.resumeData = {
      ...this.resumeForm.value,
      sectionVisibility: this.sectionVisibility
    };
    console.log('Resume Data Updated:', this.resumeData);
  }

  // Set active section
  setActiveSection(sectionId: string) {
    this.activeSection = sectionId;
  }

  // Toggle section visibility
  toggleSectionVisibility(sectionId: string) {
    this.sectionVisibility[sectionId] = !this.sectionVisibility[sectionId];
    this.updateResumeData();
  }

  // Submit form
  submitForm() {
    if (this.resumeForm.valid) {
      console.log('Resume Data:', this.resumeForm.value);
      // Here you would typically save the data or perform other actions
      alert('Resume saved successfully!');
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched(this.resumeForm);
      alert('Please fill all required fields.');
    }
  }

  // Helper method to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Change template
  changeTemplate(templateType: string) {
    this.templateType = templateType;
  }

  // Save as PDF using jsPDF and html2canvas
  saveAsPdf() {
    if (!this.previewContainer || this.isGeneratingPdf) {
      return;
    }
    
    this.isGeneratingPdf = true;
    
    // Get the resume name for the filename
    const resumeName = this.resumeData?.personalDetails?.name || 'Resume';
    const fileName = `${resumeName.replace(/\s+/g, '_')}_${this.templateType}_resume.pdf`;
    
    // Create a loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'pdf-loading-indicator';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>Generating PDF...</p>';
    document.body.appendChild(loadingIndicator);
    
    // Get the element to convert
    const element = this.previewContainer.nativeElement;
    
    // Use setTimeout to allow the UI to update with the loading indicator
    setTimeout(() => {
      // Use html2canvas to capture the element
      html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for images
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      }).then(canvas => {
        // Create PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // Calculate dimensions to fit the content properly
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        // Add image to PDF (first page)
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add new pages if the content is longer than one page
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        // Save the PDF
        pdf.save(fileName);
        
        // Clean up
        document.body.removeChild(loadingIndicator);
        this.isGeneratingPdf = false;
      }).catch(error => {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
        document.body.removeChild(loadingIndicator);
        this.isGeneratingPdf = false;
      });
    }, 100);
  }
}
