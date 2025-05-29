import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ResumeListComponent } from '../resume-list/resume-list.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SaveResumeModalComponent } from '../save-resume-modal/save-resume-modal.component';
import { ResumeService } from '../../services/resume.service';
import { HeaderComponent } from '../shared/header/header.component';
import { AuthService } from '../../services/auth.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModernTemplateComponent } from '../resume-templates/modern-template/modern-template.component';
import { MinimalTemplateComponent } from '../resume-templates/minimal-template/minimal-template.component';
import { CreativeTemplateComponent } from '../resume-templates/creative-template/creative-template.component';
import { ProfessionalTemplateComponent } from '../resume-templates/professional-template/professional-template.component';
import { ExecutiveTemplateComponent } from '../resume-templates/executive-template/executive-template.component';
import { TechnicalTemplateComponent } from '../resume-templates/technical-template/technical-template.component';
import { CompactTemplateComponent } from '../resume-templates/compact-template/compact-template.component';
import { RatingTemplateComponent } from '../resume-templates/rating-template/rating-template.component';
import { TimelineTemplateComponent } from '../resume-templates/timeline-template/timeline-template.component';

@Component({
  selector: 'app-resume-editor',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ReactiveFormsModule,
    RouterLink,
    ModernTemplateComponent,
    MinimalTemplateComponent,
    CreativeTemplateComponent,
    ProfessionalTemplateComponent,
    ExecutiveTemplateComponent,
    TechnicalTemplateComponent,
    CompactTemplateComponent,
    RatingTemplateComponent,
    TimelineTemplateComponent,
    SaveResumeModalComponent,
    ResumeListComponent
  ],
  templateUrl: './resume-editor.component.html',
  styleUrls: ['./resume-editor.component.css']
})
export class ResumeEditorComponent implements OnInit {
  showTemplateDropdown = false;
  templates = [
    { id: 'modern', name: 'Modern', icon: 'fas fa-window-maximize' },
    { id: 'minimal', name: 'Minimal', icon: 'fas fa-minus-square' },
    { id: 'creative', name: 'Creative', icon: 'fas fa-paint-brush' },
    { id: 'professional', name: 'Professional', icon: 'fas fa-briefcase' },
    { id: 'executive', name: 'Executive', icon: 'fas fa-user-tie' },
    { id: 'technical', name: 'Technical', icon: 'fas fa-code' },
    { id: 'compact', name: 'Compact', icon: 'fas fa-compress' },
    { id: 'rating', name: 'Rating', icon: 'fas fa-star' },
    { id: 'timeline', name: 'Timeline', icon: 'fas fa-stream' }
  ];
  @ViewChild('previewContainer') previewContainer!: ElementRef;
  @ViewChild('resumeList') resumeList!: ResumeListComponent;
  templateType: string = 'modern';
  resumeForm: FormGroup;
  currentResumeId: string | null = null;
  currentResume: any = null;
  resumeData: any = {};
  activeSection: string = 'personalDetails';
  isGeneratingPdf: boolean = false;
  showSaveModal = false;
  
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
    private resumeService: ResumeService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.resumeForm = this.createResumeForm();
  }

  ngOnInit() {
    // Get template type from route parameter
    this.route.paramMap.subscribe(params => {
      const type = params.get('type');
      if (type && ['modern', 'minimal', 'creative', 'professional', 'executive', 'technical', 'compact', 'rating', 'timeline'].includes(type)) {
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
        profileImage: [null],
        imagePosition: ['left'], // can be 'left', 'center', or 'right'
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        socialLinks: this.fb.array([this.createSocialLink()]) // Initialize with one social link
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
      education: this.fb.array([this.createEducation()]), // Initialize with one education entry
      experience: this.fb.array([this.createExperience()]),
      skills: this.fb.array([this.createSkill()]),
      projects: this.fb.array([this.createProject()])
    });
  }

  // Helper methods to create form groups
  createEducation() {
    return this.fb.group({
      degree: [''],
      institution: [''],
      year: [''],
      description: [''],
      visible: [true]
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
      platform: [''], // e.g., 'GitHub', 'LinkedIn'
      url: [''],
      visible: [true]
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
  }

  onProfileImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        this.resumeForm.patchValue({
          personalDetails: {
            profileImage: imageUrl
          }
        });
        this.updateResumeData();
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfileImage() {
    this.resumeForm.patchValue({
      personalDetails: {
        profileImage: null
      }
    });
    this.updateResumeData();
  }

  setImagePosition(position: 'left' | 'center' | 'right') {
    this.resumeForm.patchValue({
      personalDetails: {
        imagePosition: position
      }
    });
    this.updateResumeData();
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
  loadResume(resume: any) {
    this.currentResumeId = resume._id;
    this.currentResume = resume;
    // Keep current template, don't change it
    // this.templateType = resume.templateName;
    
    // Patch form values
    this.resumeForm.patchValue({
      personalDetails: resume.personalDetails,
      address: resume.address,
      professionalSummary: resume.professionalSummary
    });
    


    // Handle arrays
    const educationArray = this.resumeForm.get('education') as FormArray;
    educationArray.clear();
    if (resume.educationIds?.length) {
      resume.educationIds.forEach((edu: any) => {
        educationArray.push(this.fb.group({
          degree: [edu.degree, Validators.required],
          institution: [edu.institution, Validators.required],
          year: [edu.year, Validators.required],
          description: [edu.description],
          visible: [edu.visible]
        }));
      });
    }

    const experienceArray = this.resumeForm.get('experience') as FormArray;
    experienceArray.clear();
    if (resume.experienceIds?.length) {
      resume.experienceIds.forEach((exp: any) => {
        experienceArray.push(this.fb.group({
          jobTitle: [exp.jobTitle, Validators.required],
          company: [exp.company, Validators.required],
          yearsWorked: [exp.yearsWorked, Validators.required],
          description: [exp.description],
          industry: [exp.industry],
          location: [exp.location],
          visible: [exp.visible]
        }));
      });
    }

    const skillsArray = this.resumeForm.get('skills') as FormArray;
    skillsArray.clear();
    if (resume.skillIds?.length) {
      resume.skillIds.forEach((skill: any) => {
        skillsArray.push(this.fb.group({
          skillName: [skill.skill.name, Validators.required],
          category: [skill.skill.category],
          description: [skill.description],
          skillLevel: [skill.skillLevel],
          visible: [skill.visible]
        }));
      });
    }

    const projectsArray = this.resumeForm.get('projects') as FormArray;
    projectsArray.clear();
    if (resume.projectIds?.length) {
      resume.projectIds.forEach((proj: any) => {
        const techStack = proj.techStack?.map((tech: any) => tech.name) || [];
        projectsArray.push(this.fb.group({
          projectName: [proj.projectName, Validators.required],
          description: [proj.description],
          role: [proj.role],
          techStack: [techStack],
          additionalInfo: this.fb.array(proj.additionalInfo || []),
          visible: [proj.visible],
          status: [proj.status],
          category: [proj.category],
          teamSize: [proj.teamSize],
          links: [proj.links],
          highlights: [proj.highlights]
        }));
      });
    }

    // Update template preview with new data after all form updates
    this.updateResumeData();
  }

  onSaveResume(title: string) {
    const resumeData = {
      ...this.resumeForm.value,
      title: title,
      templateName: this.templateType
    };

    const request = this.currentResumeId ?
      this.resumeService.updateResume(this.currentResumeId, resumeData) :
      this.resumeService.saveResume(resumeData);

    request.subscribe(
      (response) => {
        alert('Resume saved successfully!');
        this.showSaveModal = false;
        if (this.resumeList) {
          this.resumeList.loadResumes(); // Refresh the list
        }
      },
      (error) => {
        alert('Error saving resume: ' + error.message);
      }
    );
  }

  onCancelSave() {
    this.showSaveModal = false;
  }

  submitForm() {
    if (!this.authService.isLoggedIn()) {
      // Store the current form data in session storage
      sessionStorage.setItem('pendingResumeData', JSON.stringify(this.resumeForm.value));
      // Redirect to login
      this.router.navigate(['/auth/login']);
      return;
    }

    const educationArray = this.resumeForm.get('education') as FormArray;
    const hasValidEducation = educationArray.length > 0 && educationArray.controls.some(control => !control.errors);

    const personalDetails = this.resumeForm.get('personalDetails');
    if (!personalDetails) return;
    
    const socialLinksArray = personalDetails.get('socialLinks') as FormArray;
    const hasValidSocialLink = socialLinksArray.length > 0 && socialLinksArray.controls.some(control => !control.errors);

    if (this.resumeForm.valid && hasValidEducation && hasValidSocialLink) {
      this.showSaveModal = true;
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched(this.resumeForm);
      
      // Show validation errors
      let errorMessage = 'Please fix the following errors:\n';
      
      if (!hasValidEducation) {
        errorMessage += '- At least one valid education entry is required\n';
      }
      
      if (!hasValidSocialLink) {
        errorMessage += '- At least one valid social link is required\n';
      }
      
      alert(errorMessage);
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
  changeTemplate(type: string) {
    this.templateType = type;
    this.updateResumeData();
    this.showTemplateDropdown = false;
    // Update URL without reloading
    this.router.navigate(['/editor', type], { replaceUrl: true });
  }

  toggleTemplateDropdown() {
    this.showTemplateDropdown = !this.showTemplateDropdown;
  }

  toggleResumeList() {
    if (this.resumeList) {
      this.resumeList.toggleList();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const templateSelector = document.querySelector('.template-selector');
    if (templateSelector && !templateSelector.contains(event.target as Node)) {
      this.showTemplateDropdown = false;
    }
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
      // Calculate dimensions
      const a4Width = 210; // A4 width in mm
      const a4Height = 297; // A4 height in mm
      const padding = 15; // Padding in mm (matching CSS)
      
      // Use html2canvas to capture the element
      html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for images
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight,
        x: 0,
        y: 0,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight
      }).then(canvas => {
        // Create PDF with A4 size
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });

        // Calculate dimensions to fit content properly
        const margin = 10; // 10mm margin
        const pdfWidth = 210; // A4 width in mm
        const pdfHeight = 297; // A4 height in mm
        const contentWidth = pdfWidth - (2 * margin);
        const contentHeight = pdfHeight - (2 * margin);
        
        // Calculate scaling to maintain aspect ratio
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * contentWidth) / canvas.width;
        
        // Position for first page
        let heightLeft = imgHeight;
        let position = margin; // Start from top margin
        
        // Add image to PDF (first page)
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 1.0),
          'JPEG',
          margin,
          position,
          imgWidth,
          imgHeight,
          '',
          'FAST'
        );
        heightLeft -= (contentHeight);

        // Add new pages if the content is longer than one page
        while (heightLeft > 0) {
          pdf.addPage();
          position = heightLeft - imgHeight + margin;
          pdf.addImage(
            canvas.toDataURL('image/jpeg', 1.0),
            'JPEG',
            margin,
            position,
            imgWidth,
            imgHeight,
            '',
            'FAST'
          );
          heightLeft -= contentHeight;
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
