import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-rating">
      <span *ngFor="let star of stars; let i = index" 
            class="star"
            [class.filled]="i < rating"
            [class.hover]="i < hoverRating"
            (mouseenter)="onStarHover(i + 1)"
            (mouseleave)="onStarLeave()"
            (click)="onStarClick(i + 1)">
        <i class="fas fa-star"></i>
      </span>
    </div>
  `,
  styles: [`
    .star-rating {
      display: inline-flex;
      gap: 4px;
    }
    .star {
      color: #e2e8f0;
      font-size: 1.2em;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .star.filled {
      color: #fbbf24;
    }
    .star.hover {
      color: #fcd34d;
      transform: scale(1.1);
    }
    .star:hover ~ .star {
      color: #e2e8f0;
    }
  `]
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Output() ratingChange = new EventEmitter<number>();
  
  stars: number[] = Array(5).fill(0);
  hoverRating: number = 0;

  onStarHover(rating: number): void {
    this.hoverRating = rating;
  }

  onStarLeave(): void {
    this.hoverRating = 0;
  }

  onStarClick(rating: number): void {
    this.rating = rating;
    this.ratingChange.emit(rating);
  }
}
