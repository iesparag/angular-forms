import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';

@Component({
  selector: 'app-rating-template',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  templateUrl: './rating-template.component.html',
  styleUrls: ['./rating-template.component.css']
})
export class RatingTemplateComponent {
  @Input() resumeData: any;

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  getProgressWidth(level: number): string {
    return `${level * 20}%`;
  }

  getCircleProgress(level: number): number {
    return level * 20;
  }

  onSkillRatingChange(skill: any, rating: number): void {
    skill.level = rating;
  }
}
