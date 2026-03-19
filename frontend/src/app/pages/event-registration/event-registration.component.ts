import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService, Event } from '../../core/services/event.service';
import { RegistrationService } from '../../core/services/registration.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-event-registration',
  standalone: true,
  imports: [CommonModule, RouterLink, NzCardModule, NzButtonModule, NzResultModule, NzSpinModule, NzIconModule, NzProgressModule, NzTagModule, NzGridModule],
  template: `
    <div style="background: #f9fafb; min-height: 100vh; padding: 40px 24px;">
      <div *ngIf="isLoading" style="text-align: center; padding: 50px 0;">
        <nz-spin nzSimple nzSize="large"></nz-spin>
      </div>

      <ng-container *ngIf="!isLoading && event">
        <div style="max-width: 1200px; margin: 0 auto;">
          
          <!-- Header Area -->
          <div style="margin-bottom: 24px; display: flex; justify-content: flex-end;">
            <a routerLink="/events" style="color: #475467; font-size: 15px; display: inline-flex; align-items: center; gap: 8px; font-weight: 500; text-decoration: none; transition: color 0.2s;">
              <span nz-icon nzType="arrow-left"></span> Back to Events
            </a>
          </div>

          <!-- Full Width (respecting padding) Image Section -->
          <div style="width: 100%; height: 440px; background: #eaecf0; border-radius: 16px; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <img *ngIf="event.imageUrl" [src]="'http://localhost:5000' + event.imageUrl" style="width: 100%; height: 100%; object-fit: cover;" alt="Event Banner" />
            <span *ngIf="!event.imageUrl" style="color: #667085; font-size: 24px;">Image Placeholder</span>
            
            <nz-tag [nzColor]="'#1890ff'" style="position: absolute; top: 24px; left: 24px; font-weight: bold; border: none; padding: 4px 16px; font-size: 14px; z-index: 2; border-radius: 6px;">
              {{ event.category | uppercase }}
            </nz-tag>
          </div>

          
          <!-- Split Content Area -->
          <nz-row [nzGutter]="[40, 40]">
            <!-- Left Side: About Event -->
            <div nz-col [nzXs]="24" [nzLg]="16">
              <h1 style="font-size: 36px; font-weight: 800; margin-bottom: 32px; color: #101828; line-height: 1.2;">
                {{ event.title }}
              </h1>

              <div style="background: #fff; padding: 32px; border-radius: 12px; border: 1px solid #eaecf0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #101828;">About the Event</h3>
                <p style="color: #475467; line-height: 1.8; font-size: 16px; white-space: pre-wrap; margin: 0;">{{ event.description }}</p>
              </div>
            </div>

            <!-- Right Side: Details & Registration -->
            <div nz-col [nzXs]="24" [nzLg]="8">
              <div style="position: sticky; top: 24px;">
                <!-- Event Details Card -->
                <div style="background: #fff; padding: 32px; border-radius: 12px; border: 1px solid #eaecf0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin-bottom: 24px;">
                  
                  <div style="display: flex; flex-direction: column; gap: 24px; margin-bottom: 32px;">
                    <div style="display: flex; gap: 16px;">
                      <div style="width: 40px; height: 40px; border-radius: 8px; background: #e6f7ff; display: flex; align-items: center; justify-content: center;">
                        <span nz-icon nzType="calendar" nzTheme="fill" style="color: #1890ff; font-size: 20px;"></span>
                      </div>
                      <div>
                        <div style="font-weight: 600; color: #101828; margin-bottom: 4px; font-size: 15px;">Date</div>
                        <div style="color: #475467; font-size: 15px;">{{ event.eventDate | date:'fullDate' }}</div>
                      </div>
                    </div>

                    <div style="display: flex; gap: 16px;">
                      <div style="width: 40px; height: 40px; border-radius: 8px; background: #e6f7ff; display: flex; align-items: center; justify-content: center;">
                        <span nz-icon nzType="clock-circle" nzTheme="fill" style="color: #1890ff; font-size: 20px;"></span>
                      </div>
                      <div>
                        <div style="font-weight: 600; color: #101828; margin-bottom: 4px; font-size: 15px;">Time & Duration</div>
                        <div style="color: #475467; font-size: 15px;">
                          {{ event.eventDate | date:'shortTime' }}
                          <span *ngIf="event.durationInDays > 1" style="display: block; margin-top: 2px;">Duration: {{ event.durationInDays }} Days</span>
                        </div>
                      </div>
                    </div>

                    <div style="display: flex; gap: 16px;">
                      <div style="width: 40px; height: 40px; border-radius: 8px; background: #e6f7ff; display: flex; align-items: center; justify-content: center;">
                        <span nz-icon nzType="environment" nzTheme="fill" style="color: #1890ff; font-size: 20px;"></span>
                      </div>
                      <div>
                        <div style="font-weight: 600; color: #101828; margin-bottom: 4px; font-size: 15px;">Venue</div>
                        <div style="color: #475467; font-size: 15px;">{{ event.venue }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Registration Status inside the card -->
                  <div style="background: #f0f7ff; border-radius: 8px; padding: 16px; margin-bottom: 32px; border: 1px solid #e6f4ff;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; color: #1890ff; font-weight: 600;">
                      <span>Registration Status</span>
                      <span>{{ getProgressPercentage() }}% Full</span>
                    </div>
                    <nz-progress [nzPercent]="getProgressPercentage()" [nzShowInfo]="false" nzSize="small" [nzStrokeColor]="getProgressPercentage() >= 90 ? '#f79009' : '#1890ff'"></nz-progress>
                    <div style="color: #667085; font-size: 13px; margin-top: 8px;">
                      Only {{ event.availableSeats }} seats remaining.
                    </div>
                  </div>

                  <div *ngIf="event.isSoldOut" style="text-align: center; margin-bottom: 24px;">
                    <nz-result nzStatus="error" nzTitle="Sold Out" style="padding: 0;"></nz-result>
                  </div>

                  <!-- Price & Button area -->
                  <div style="border-top: 1px solid #eaecf0; padding-top: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                      <span style="color: #667085; font-weight: 500;">Total Price</span>
                      <span style="font-size: 24px; font-weight: 800; color: #101828;">{{ event.price | currency:'INR':'symbol':'1.2-2' }}</span>
                    </div>
                    
                    <button 
                      nz-button 
                      [nzType]="event.isSoldOut ? 'default' : 'primary'" 
                      [nzLoading]="isRegistering"
                      (click)="register()"
                      [disabled]="event.isSoldOut"
                      style="width: 100%; height: 48px; font-weight: 600; font-size: 16px; border-radius: 8px;">
                      {{ event.isSoldOut ? 'Sold Out' : 'Register Now' }}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </nz-row>
        </div>
      </ng-container>
    </div>
  `
})
export class EventRegistrationComponent implements OnInit {
  event: Event | null = null;
  isLoading = true;
  isRegistering = false;
  eventId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private registrationService: RegistrationService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    if (this.eventId) {
      this.loadEvent();
    }
  }

  loadEvent(): void {
    this.eventService.getById(this.eventId).subscribe({
      next: (data) => {
        this.event = data;
        this.isLoading = false;
      },
      error: () => {
        this.message.error('Failed to load event details.');
        this.router.navigate(['/events']);
      }
    });
  }

  register(): void {
    this.isRegistering = true;
    this.registrationService.register(this.eventId).subscribe({
      next: () => {
        this.message.success('Registration successful!');
        this.router.navigate(['/my-events']);
      },
      error: (err) => {
        this.message.error(err.error?.message || 'Registration failed.');
        this.isRegistering = false;
        // Reload event to get updated seat count in case it sold out
        this.loadEvent();
      }
    });
  }

  getProgressPercentage(): number {
    if (!this.event || this.event.totalSeats === 0) return 0;
    return Math.round((this.event.occupiedSeats / this.event.totalSeats) * 100);
  }
}
