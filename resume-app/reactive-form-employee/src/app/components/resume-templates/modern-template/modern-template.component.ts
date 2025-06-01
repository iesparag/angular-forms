import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modern-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modern-template.component.html',
  styleUrls: ['./modern-template.component.css']
})
export class ModernTemplateComponent {
  @Input() resumeData: any;

  getSocialIcon(platform: string): string {
    const platformLower = platform.toLowerCase();
    
    // Map platforms to Font Awesome icons
    const iconMap: { [key: string]: string } = {
      'github': 'fab fa-github',
      'linkedin': 'fab fa-linkedin',
      'twitter': 'fab fa-twitter',
      'facebook': 'fab fa-facebook',
      'instagram': 'fab fa-instagram',
      'portfolio': 'fas fa-globe',
      'website': 'fas fa-globe',
      'blog': 'fas fa-blog',
      'medium': 'fab fa-medium',
      'stackoverflow': 'fab fa-stack-overflow',
      'dev.to': 'fab fa-dev',
      'gitlab': 'fab fa-gitlab',
      'bitbucket': 'fab fa-bitbucket',
      'youtube': 'fab fa-youtube',
      'behance': 'fab fa-behance',
      'dribbble': 'fab fa-dribbble'
    };

    // Return the mapped icon or a default link icon
    return iconMap[platformLower] || 'fas fa-link';
  }
}
