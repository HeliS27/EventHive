import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationService, Analytics } from '../../../core/services/registration.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzGridModule, NzIconModule, NzSpinModule],
  template: `
    <div style="padding: 8px 0;">
      <h1 style="font-size: 26px; font-weight: 800; color: #101828; margin-bottom: 4px;">Dashboard Analytics</h1>
      <p style="color: #667085; font-size: 14px; margin-bottom: 28px;">Overview of EventHive performance and registrations.</p>

      <div *ngIf="isLoading" style="text-align: center; margin: 50px 0;">
        <nz-spin nzSimple nzSize="large"></nz-spin>
      </div>

      <div *ngIf="!isLoading && analytics">
        <!-- Top Analytics Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 24px;">
          <div class="stat-card">
            <div class="stat-icon" style="background: #eff6ff;">
              <span nz-icon nzType="rise" style="color: #1d4ed8; font-size: 20px;"></span>
            </div>
            <div class="stat-label">Registrations Today</div>
            <div class="stat-value">{{ analytics.totalRegistrationsToday }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: #f0fdf4;">
              <span nz-icon nzType="solution" style="color: #16a34a; font-size: 20px;"></span>
            </div>
            <div class="stat-label">Total Tickets Issued</div>
            <div class="stat-value">{{ analytics.totalRegistrations }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: #faf5ff;">
              <span nz-icon nzType="team" style="color: #7c3aed; font-size: 20px;"></span>
            </div>
            <div class="stat-label">Registered Users</div>
            <div class="stat-value">{{ analytics.totalStudents }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: #fff7ed;">
              <span nz-icon nzType="calendar" style="color: #ea580c; font-size: 20px;"></span>
            </div>
            <div class="stat-label">Total Events</div>
            <div class="stat-value">{{ analytics.totalEvents }}</div>
          </div>
        </div>

        <!-- Capacity & Most Popular Event -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
          <div class="detail-card">
            <div class="detail-label">Total Capacity Filled</div>
            <div style="font-size: 2rem; font-weight: 800; color: #101828; margin-bottom: 12px;">{{ analytics.capacityFilledPercentage | number:'1.1-1' }}%</div>
            <div style="background: #e5e7eb; border-radius: 8px; height: 10px; overflow: hidden;">
              <div style="background: #1d4ed8; height: 100%; border-radius: 8px; transition: width 0.5s;" [style.width.%]="analytics.capacityFilledPercentage"></div>
            </div>
            <div style="font-size: 13px; color: #667085; margin-top: 6px; text-align: right;">
              PROGRESS <span style="color: #1d4ed8; font-weight: 700;">{{ analytics.capacityFilledPercentage | number:'1.1-1' }}%</span>
            </div>
          </div>

          <div class="detail-card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
              <span style="background: #eff6ff; border-radius: 50%; padding: 8px; display: flex; align-items: center; justify-content: center;">
                <span nz-icon nzType="fire" style="color: #1d4ed8; font-size: 18px;"></span>
              </span>
              <span class="detail-label" style="margin-bottom: 0;">Most Popular Event</span>
              <span style="background: #f79009; color: #fff; font-size: 11px; font-weight: 700; border-radius: 6px; padding: 2px 10px;">HOT</span>
            </div>
            <div style="font-size: 18px; font-weight: 700; color: #101828;">{{ analytics.mostPopularEvent || 'No events yet' }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: #fff;
      border-radius: 12px;
      border: 1px solid #eaecf0;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }
    .stat-label {
      font-size: 14px;
      color: #667085;
      font-weight: 600;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      color: #101828;
    }
    .detail-card {
      background: #fff;
      border-radius: 12px;
      border: 1px solid #eaecf0;
      padding: 28px;
    }
    .detail-label {
      font-size: 14px;
      color: #667085;
      font-weight: 600;
      margin-bottom: 8px;
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  analytics: Analytics | null = null;
  isLoading = true;

  constructor(private registrationService: RegistrationService) {}

  ngOnInit(): void {
    this.registrationService.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching analytics', err);
        this.isLoading = false;
      }
    });
  }
}
