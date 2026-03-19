import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService, Event } from '../../core/services/event.service';
import { AuthService } from '../../core/services/auth.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-event-discovery',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    FormsModule,
    NzCardModule, 
    NzGridModule, 
    NzTagModule, 
    NzButtonModule, 
    NzIconModule, 
    NzEmptyModule, 
    NzSpinModule,
    NzInputModule,
    NzSelectModule,
    NzProgressModule,
    NzPaginationModule
  ],
  template: `
    <div style="display: flex; min-height: calc(100vh - 64px); background: #f9fafb;">
      
      <!-- Fixed Sidebar (No left gap) -->
      <div style="width: 260px; background: #fff; border-right: 1px solid #eaecf0; padding: 32px 0; flex-shrink: 0;">
        
        <!-- Search in sidebar -->
        <div style="padding: 0 16px; margin-bottom: 24px;">
          <h3 style="font-size: 12px; font-weight: 700; color: #98a2b3; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 12px;">Find Events</h3>
          <nz-input-group [nzPrefix]="searchIcon" style="border-radius: 8px;">
            <input type="text" nz-input placeholder="Search events..." [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()" style="border-radius: 8px; padding: 8px 12px; font-size: 14px; background: #fff; border: 1px solid #eaecf0;" />
          </nz-input-group>
          <ng-template #searchIcon><span nz-icon nzType="search" style="color: #667085;"></span></ng-template>
        </div>

        <div style="padding: 0 24px; margin-bottom: 16px;">
          <h3 style="font-size: 12px; font-weight: 700; color: #98a2b3; letter-spacing: 0.05em; text-transform: uppercase;">Categories</h3>
        </div>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column;">
          <li style="padding: 4px 16px;">
            <button class="nav-item" [class.active]="selectedCategory === null" (click)="selectCategory(null)">
              <span nz-icon nzType="appstore" nzTheme="fill" style="margin-right: 12px; font-size: 16px;"></span> All Events
            </button>
          </li>
          <li style="padding: 4px 16px;">
            <button class="nav-item" [class.active]="selectedCategory === 'Workshop'" (click)="selectCategory('Workshop')">
              <span nz-icon nzType="tool" nzTheme="fill" style="margin-right: 12px; font-size: 16px;"></span> Workshops
            </button>
          </li>
          <li style="padding: 4px 16px;">
            <button class="nav-item" [class.active]="selectedCategory === 'Hackathon'" (click)="selectCategory('Hackathon')">
              <span nz-icon nzType="laptop" style="margin-right: 12px; font-size: 16px;"></span> Hackathons
            </button>
          </li>
          <li style="padding: 4px 16px;">
            <button class="nav-item" [class.active]="selectedCategory === 'Seminar'" (click)="selectCategory('Seminar')">
              <span nz-icon nzType="audio" nzTheme="fill" style="margin-right: 12px; font-size: 16px;"></span> Seminars
            </button>
          </li>
        </ul>
      </div>

      <!-- Main Content Area -->
      <div style="flex: 1; padding: 40px 48px; max-width: calc(100% - 260px);">
        
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 32px; font-weight: 800; color: #101828; margin-bottom: 8px; letter-spacing: -0.5px;">Discover Tech Events</h2>
          <p style="color: #667085; font-size: 16px; margin: 0;">{{ displayedEvents.length }} upcoming events found in your area</p>
        </div>

        <div *ngIf="isLoading" style="text-align: center; margin: 50px 0;">
          <nz-spin nzSimple nzSize="large"></nz-spin>
        </div>

        <div *ngIf="!isLoading">
          <nz-empty *ngIf="displayedEvents.length === 0" nzNotFoundContent="No events match your search criteria."></nz-empty>

          <!-- Event Grid -->
            <div nz-row [nzGutter]="[24, 24]" style="margin-bottom: 32px;">
              <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="12" [nzLg]="8" *ngFor="let event of paginatedEvents">
                <nz-card [nzHoverable]="true" class="custom-event-card" [nzBodyStyle]="{ padding: '0' }">
          
          <!-- Image Area -->
          <div class="card-image-wrapper">
            <img *ngIf="event.imageUrl" [src]="'http://localhost:5000' + event.imageUrl" alt="Event Image" class="event-image" />
            <div *ngIf="!event.imageUrl" class="event-image-placeholder">
              <span nz-icon nzType="picture" style="font-size: 32px; color: #98a2b3;"></span>
            </div>
          </div>

          <!-- Content Area -->
          <div class="card-content">
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px;">
              <nz-tag [nzColor]="getCategoryColor(event.category)" class="category-tag">{{ event.category | uppercase }}</nz-tag>
              <span style="color: #98a2b3; font-size: 12px;">• {{ event.venue }}</span>
            </div>
            
            <h3 class="event-title">{{ event.title }}</h3>
            
            <div class="event-date">
              <span nz-icon nzType="calendar" style="margin-right: 6px;"></span>
              {{ event.eventDate | date:'mediumDate' }}
            </div>
            
            <div class="progress-section">
              <div class="progress-header">
                <span>Registration Progress</span>
                <span style="font-weight: 600; color: #101828;">{{ getPercentFilled(event) }}% full</span>
              </div>
              <nz-progress 
                [nzPercent]="getPercentFilled(event)" 
                [nzShowInfo]="false" 
                nzSize="small"
                [nzStrokeColor]="getPercentFilled(event) >= 90 ? '#f79009' : '#1890ff'"
                style="margin-bottom: 24px;">
              </nz-progress>
            </div>
            
                <button 
                  nz-button 
                  [nzType]="event.isSoldOut ? 'default' : 'primary'" 
                  class="action-button"
                  [disabled]="event.isSoldOut"
                  [routerLink]="event.isSoldOut ? null : ['/events', event.id, 'register']">
                  {{ event.isSoldOut ? 'Sold Out' : 'Register Now' }}
                </button>
              </div>
            </nz-card>
          </div>
        </div>

        <!-- Pagination -->
        <div *ngIf="displayedEvents.length > 0" style="display: flex; justify-content: center; margin-top: 40px; margin-bottom: 20px;">
          <nz-pagination 
            [(nzPageIndex)]="pageIndex" 
            [nzTotal]="displayedEvents.length" 
            [(nzPageSize)]="pageSize" 
            (nzPageIndexChange)="onPageIndexChange($event)">
          </nz-pagination>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .nav-item {
      width: 100%;
      text-align: left;
      padding: 12px 16px;
      border: none;
      background: transparent;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 500;
      color: #344054;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s;
    }
    .nav-item:hover {
      background: #f2f4f7;
      color: #101828;
    }
    .nav-item.active {
      background: #eff8ff;
      color: #1890ff;
      font-weight: 600;
    }
    .custom-event-card {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #eaecf0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      transition: transform 0.2s, box-shadow 0.2s;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .custom-event-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .card-image-wrapper {
      height: 200px;
      width: 100%;
      background: #f2f4f7;
      border-bottom: 1px solid #eaecf0;
    }
    .event-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .event-image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-content {
      padding: 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .category-tag {
      border: none;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
    }
    .event-title {
      font-size: 18px;
      font-weight: 700;
      color: #101828;
      margin-bottom: 12px;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .event-date {
      color: #667085;
      font-size: 14px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
    }
    .progress-section {
      margin-bottom: 24px;
    }
    .progress-header {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #667085;
      margin-bottom: 8px;
    }
    .action-button {
      width: 100%;
      height: 40px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      margin-top: auto;
      background: var(--primary-color) !important;
      color: var(--white) !important;
      border: none !important;
    }
  `]
})
export class EventDiscoveryComponent implements OnInit {
  allEvents: Event[] = [];
  displayedEvents: Event[] = [];
  isLoading = true;

  searchTerm: string = '';
  selectedCategory: string | null = null;

  pageIndex = 1;
  pageSize = 6;
  paginatedEvents: Event[] = [];

  constructor(
    private eventService: EventService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.allEvents = data;
        this.displayedEvents = [...this.allEvents];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching events', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.displayedEvents = this.allEvents.filter(event => {
      const matchSearch = this.searchTerm ? event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const matchCategory = (this.selectedCategory && this.selectedCategory !== 'All') ? event.category === this.selectedCategory : true;
      return matchSearch && matchCategory;
    });
    this.pageIndex = 1; // reset to first page
    this.updatePagination();
  }

  selectCategory(category: string | null): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  updatePagination(): void {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEvents = this.displayedEvents.slice(startIndex, endIndex);
  }

  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.updatePagination();
  }

  getPercentFilled(event: Event): number {
    if (event.totalSeats === 0) return 0;
    return Math.round((event.occupiedSeats / event.totalSeats) * 100);
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'Workshop': return 'blue';
      case 'Hackathon': return 'purple';
      case 'Seminar': return 'cyan';
      default: return 'default';
    }
  }
}

