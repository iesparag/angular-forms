import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Template {
  type: string;
  name: string;
  image: string;
  description: string;
  category: string;
  tags: string[];
  popularity: number;
}

type ViewMode = 'grid' | 'list';

interface Filter {
  categories: string[];
  tags: string[];
  sortBy: 'name' | 'popularity';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  viewMode: ViewMode = 'grid';
  searchQuery: string = '';
  activeFilters: Filter = {
    categories: [],
    tags: [],
    sortBy: 'popularity'
  };

  // User profile properties
  isLoggedIn: boolean = false;
  isProfileMenuOpen: boolean = false;
  user: User | null = null;

  categories = [
    'Professional',
    'Creative',
    'Simple',
    'Modern',
    'Academic',
    'Technical'
  ];

  tags = [
    'Minimalist',
    'Colorful',
    'Traditional',
    'Innovative',
    'Corporate',
    'Startup',
    'Executive',
    'Entry-Level'
  ];
  templates: Template[] = [
    { 
      type: 'modern', 
      name: 'Modern Template', 
      image: 'assets/images/modern-template-preview.png',
      description: 'A clean, professional design with a modern layout',
      category: 'Modern',
      tags: ['Minimalist', 'Corporate'],
      popularity: 95
    },
    { 
      type: 'minimal', 
      name: 'Minimal Template', 
      image: 'assets/images/minimal-template-preview.png',
      description: 'A simple, elegant design that focuses on content',
      category: 'Simple',
      tags: ['Minimalist'],
      popularity: 90
    },
    { 
      type: 'creative', 
      name: 'Creative Template',
      image: 'assets/images/creative-template-preview.png', 
      description: 'Stand out with a unique and creative design',
      category: 'Creative',
      tags: ['Colorful', 'Innovative'],
      popularity: 85
    },
    { 
      type: 'professional', 
      name: 'Professional Template', 
      image: 'assets/images/professional-template-preview.png',
      description: 'A traditional format perfect for corporate applications',
      category: 'Professional',
      tags: ['Traditional', 'Corporate'],
      popularity: 88
    },
    { 
      type: 'executive', 
      name: 'Executive Template', 
      image: 'assets/images/executive-template-preview.png',
      description: 'A sophisticated design for senior professionals',
      category: 'Professional',
      tags: ['Executive', 'Traditional'],
      popularity: 82
    },
    { 
      type: 'technical', 
      name: 'Technical Template', 
      image: 'assets/images/technical-template-preview.png',
      description: 'Perfect for software engineers and IT professionals',
      category: 'Technical',
      tags: ['Corporate', 'Technical'],
      popularity: 87
    },
    { 
      type: 'compact', 
      name: 'Compact Template', 
      image: 'assets/images/compact-template-preview.png',
      description: 'A concise one-page format that fits more content',
      category: 'Simple',
      tags: ['Minimalist', 'Entry-Level'],
      popularity: 84
    },
    { 
      type: 'rating', 
      name: 'Rating Template', 
      image: 'assets/images/rating-template-preview.png',
      description: 'Showcase your skills with visual ratings and metrics',
      category: 'Technical',
      tags: ['Innovative', 'Technical'],
      popularity: 80
    },
    { 
      type: 'timeline', 
      name: 'Timeline Template', 
      image: 'assets/images/timeline-template-preview.png',
      description: 'Tell your career story with an interactive timeline',
      category: 'Creative',
      tags: ['Innovative', 'Startup'],
      popularity: 83
    },
    // Add more templates here
  ];

  currentPage = 1;
  itemsPerPage = 12; // Show 12 templates per page (3x4 grid)
  totalPages = 1;

  displayedTemplates: Template[] = [];
  filteredTemplates: Template[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Subscribe to auth state
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      this.isLoggedIn = this.authService.isLoggedIn();
    });
  }

  ngOnInit() {
   
    
    this.filteredTemplates = [...this.templates];
    this.updatePagination();
    this.updateDisplayedTemplates();
  }

  updateDisplayedTemplates() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedTemplates = this.filteredTemplates.slice(startIndex, endIndex);
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredTemplates.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when filtering
  }

  onSearch() {
    this.applyFilters();
  }

  // User profile methods
  login() {
    // When clicking login from home page, just go to login page
    this.authService.navigateToLogin();
  }

  logout() {
    this.authService.logout();
    this.isProfileMenuOpen = false;
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  getInitials(name: string | null | undefined): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getAvatarColor(name: string | null | undefined): string {
    if (!name) return '#0066ff';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
    ];
    return colors[Math.abs(hash) % colors.length];
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  toggleCategory(category: string) {
    const index = this.activeFilters.categories.indexOf(category);
    if (index === -1) {
      this.activeFilters.categories.push(category);
    } else {
      this.activeFilters.categories.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleTag(tag: string) {
    const index = this.activeFilters.tags.indexOf(tag);
    if (index === -1) {
      this.activeFilters.tags.push(tag);
    } else {
      this.activeFilters.tags.splice(index, 1);
    }
    this.applyFilters();
  }

  setSortBy(sort: 'name' | 'popularity') {
    this.activeFilters.sortBy = sort;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.templates];

    // Apply search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (this.activeFilters.categories.length > 0) {
      filtered = filtered.filter(template =>
        this.activeFilters.categories.includes(template.category)
      );
    }

    // Apply tag filter
    if (this.activeFilters.tags.length > 0) {
      filtered = filtered.filter(template =>
        template.tags.some(tag => this.activeFilters.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (this.activeFilters.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return b.popularity - a.popularity;
      }
    });

    this.filteredTemplates = filtered;
    this.updatePagination();
    this.updateDisplayedTemplates();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedTemplates();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedTemplates();
    }
  }

  useTemplate(templateId: string) {
    if (!this.isLoggedIn) {
      // Store template URL as return URL
      this.authService.navigateToLogin(`/editor/${templateId}`);
    } else {
      this.router.navigate(['/editor', templateId]);
    }
  }

  selectTemplate(templateType: string) {
    this.useTemplate(templateType);
  }
}
