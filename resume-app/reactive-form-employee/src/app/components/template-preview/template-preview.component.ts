import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModernTemplateComponent } from '../resume-templates/modern-template/modern-template.component';
import { MinimalTemplateComponent } from '../resume-templates/minimal-template/minimal-template.component';
import { CreativeTemplateComponent } from '../resume-templates/creative-template/creative-template.component';
import { ProfessionalTemplateComponent } from '../resume-templates/professional-template/professional-template.component';

@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ModernTemplateComponent,
    MinimalTemplateComponent,
    CreativeTemplateComponent,
    ProfessionalTemplateComponent
  ],
  templateUrl: './template-preview.component.html',
  styleUrls: ['./template-preview.component.css']
})
export class TemplatePreviewComponent implements OnInit {
  templateType: string = 'modern';
  sampleResumeData: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const type = params.get('type');
      if (type && ['modern', 'minimal', 'creative', 'professional'].includes(type)) {
        this.templateType = type;
      }
    });
    this.sampleResumeData = this.createSampleData();
  }

  editResume() {
    localStorage.setItem('selectedTemplate', this.templateType);
    this.router.navigate(['/resume-form']);
  }

  createSampleData() {
    return {
      professionalSummary: 'Experienced software developer with a passion for creating elegant, efficient solutions to complex problems. Skilled in full-stack development with a focus on modern JavaScript frameworks and cloud technologies.',
      personalDetails: {
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '9876543210',
        socialLinks: [
          { platform: 'LinkedIn', url: 'https://linkedin.com/in/alexjohnson' },
          { platform: 'GitHub', url: 'https://github.com/alexjohnson' }
        ]
      },
      address: {
        houseNumber: '123',
        floor: '4th',
        street: 'Tech Avenue',
        city: 'San Francisco',
        landmark: 'Near Central Park',
        state: 'California',
        country: 'USA'
      },
      education: [
        {
          degree: 'Master of Computer Science',
          institution: 'Stanford University',
          year: '2018',
          description: 'Specialized in Artificial Intelligence and Machine Learning. Graduated with honors.'
        },
        {
          degree: 'Bachelor of Engineering',
          institution: 'MIT',
          year: '2016',
          description: 'Major in Computer Science with minor in Mathematics. Dean\'s List for all semesters.'
        }
      ],
      experience: [
        {
          jobTitle: 'Senior Software Engineer',
          company: 'Tech Innovations Inc.',
          yearsWorked: '2020 - Present',
          description: 'Lead developer for the company\'s flagship product. Managed a team of 5 developers and implemented CI/CD pipelines that reduced deployment time by 40%.'
        },
        {
          jobTitle: 'Software Developer',
          company: 'Digital Solutions LLC',
          yearsWorked: '2018 - 2020',
          description: 'Developed and maintained web applications using React and Node.js. Improved application performance by 30% through code optimization.'
        }
      ],
      skills: [
        {
          skillName: 'JavaScript/TypeScript',
          description: 'Expert in modern JavaScript and TypeScript, including ES6+ features and best practices.'
        },
        {
          skillName: 'React & Angular',
          description: 'Proficient in building responsive, scalable front-end applications using React and Angular frameworks.'
        },
        {
          skillName: 'Node.js',
          description: 'Experienced in building RESTful APIs and microservices using Node.js and Express.'
        }
      ],
      projects: [
        {
          projectName: 'E-commerce Platform',
          description: 'Developed a full-stack e-commerce platform with features like product search, shopping cart, and payment integration.',
          techStack: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
          role: 'Lead Developer',
          additionalInfo: [
            { key: 'Client', value: 'RetailCorp Inc.' },
            { key: 'Duration', value: '6 months' }
          ]
        },
        {
          projectName: 'AI-powered Resume Builder',
          description: 'Created an application that uses AI to generate personalized resume content and suggest improvements.',
          techStack: ['Angular', 'Python', 'TensorFlow', 'OpenAI API'],
          role: 'Full-stack Developer',
          additionalInfo: [
            { key: 'Users', value: '10,000+' },
            { key: 'Rating', value: '4.8/5' }
          ]
        }
      ]
    };
  }
}
