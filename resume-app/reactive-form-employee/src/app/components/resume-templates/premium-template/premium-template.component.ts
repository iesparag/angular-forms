import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-premium-template',
  templateUrl: './premium-template.component.html',
  styleUrls: ['./premium-template.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule
  ]
})
export class PremiumTemplateComponent {
  @Input() resumeData!: any;

  getStars(level: number): string[] {
    return Array(level).fill('★');
  }

  getEmptyStars(level: number): string[] {
    return Array(5 - level).fill('☆');
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short'
    });
  }

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
