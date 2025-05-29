import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-template.component.html',
  styleUrls: ['./timeline-template.component.css']
})
export class TimelineTemplateComponent {
  @Input() resumeData: any;

  getYearFromDate(dateStr: string): number {
    return new Date(dateStr).getFullYear();
  }

  getExperienceLevel(years: number): string {
    if (years >= 5) return 'Expert';
    if (years >= 3) return 'Advanced';
    if (years >= 1) return 'Intermediate';
    return 'Beginner';
  }

  getExperiencePercentage(years: number): number {
    return Math.min(years * 20, 100);
  }

  getSkillColor(level: number): string {
    const colors: { [key: number]: string } = {
      1: '#ff6b6b',
      2: '#ffd93d',
      3: '#6c5ce7',
      4: '#a8e6cf',
      5: '#3ae374'
    };
    return colors[level] || colors[1];
  }

  getRandomDelay(): string {
    return `${Math.random() * 0.5}s`;
  }
}
