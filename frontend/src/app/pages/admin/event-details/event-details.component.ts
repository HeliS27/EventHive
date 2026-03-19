import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService, EventDetail } from '../../../core/services/event.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    FormsModule,
    NzCardModule, 
    NzDescriptionsModule, 
    NzTableModule, 
    NzTagModule, 
    NzSwitchModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzProgressModule,
    NzGridModule
  ],
  template: `
    <div style="margin-bottom: 24px; display: flex; align-items: center; gap: 16px;">
      <a routerLink="/admin/events" nz-button nzType="default" nzShape="circle"><span nz-icon nzType="arrow-left"></span></a>
      <h2 style="margin: 0;">Event Details & Attendees</h2>
    </div>

    <div *ngIf="isLoading" style="text-align: center; margin: 50px 0;">
      <nz-spin nzSimple nzSize="large"></nz-spin>
    </div>

    <ng-container *ngIf="!isLoading && event">
      <!-- Event Image Banner -->
      <div style="width: 100%; height: 320px; background: #eaecf0; border-radius: 16px; position: relative; overflow: hidden; margin-bottom: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <img *ngIf="event.imageUrl" [src]="'http://localhost:5000' + event.imageUrl" style="width: 100%; height: 100%; object-fit: cover;" alt="Event Banner" />
        <span *ngIf="!event.imageUrl" style="color: #667085; font-size: 24px; display: flex; align-items: center; justify-content: center; height: 100%;">Image Placeholder</span>
        <nz-tag [nzColor]="'#1890ff'" style="position: absolute; top: 20px; left: 20px; font-weight: bold; border: none; padding: 4px 16px; font-size: 14px; border-radius: 6px;">
          {{ event.category | uppercase }}
        </nz-tag>
      </div>

      <!-- Split Content: Details Left, Status Right -->
      <nz-row [nzGutter]="[32, 32]" style="margin-bottom: 32px;">
        <!-- Left: Event Details -->
        <div nz-col [nzXs]="24" [nzLg]="16">
          <h1 style="font-size: 28px; font-weight: 800; color: #101828; margin-bottom: 24px;">{{ event.title }}</h1>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: #eff8ff; display: flex; align-items: center; justify-content: center;">
                <span nz-icon nzType="calendar" style="color: #1890ff; font-size: 18px;"></span>
              </div>
              <div>
                <div style="font-size: 12px; color: #98a2b3; font-weight: 600; text-transform: uppercase;">Date</div>
                <div style="font-size: 14px; color: #101828; font-weight: 500;">{{ event.eventDate | date:'mediumDate' }}</div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: #fef3f2; display: flex; align-items: center; justify-content: center;">
                <span nz-icon nzType="clock-circle" style="color: #f04438; font-size: 18px;"></span>
              </div>
              <div>
                <div style="font-size: 12px; color: #98a2b3; font-weight: 600; text-transform: uppercase;">Time & Duration</div>
                <div style="font-size: 14px; color: #101828; font-weight: 500;">
                  {{ event.eventDate | date:'shortTime' }} · {{ event.durationInDays }} Day<span *ngIf="event.durationInDays > 1">s</span>
                </div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: #ecfdf3; display: flex; align-items: center; justify-content: center;">
                <span nz-icon nzType="environment" style="color: #12b76a; font-size: 18px;"></span>
              </div>
              <div>
                <div style="font-size: 12px; color: #98a2b3; font-weight: 600; text-transform: uppercase;">Venue</div>
                <div style="font-size: 14px; color: #101828; font-weight: 500;">{{ event.venue }}</div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: #f9f5ff; display: flex; align-items: center; justify-content: center;">
                <span nz-icon nzType="dollar" style="color: #7a5af8; font-size: 18px;"></span>
              </div>
              <div>
                <div style="font-size: 12px; color: #98a2b3; font-weight: 600; text-transform: uppercase;">Price</div>
                <div style="font-size: 14px; color: #101828; font-weight: 500;">{{ event.price | currency:'INR':'symbol':'1.2-2' }}</div>
              </div>
            </div>
          </div>

          <div style="background: #fff; border-radius: 12px; border: 1px solid #eaecf0; padding: 24px;">
            <h3 style="font-size: 18px; font-weight: 700; color: #101828; margin-bottom: 16px;">About the Event</h3>
            <p style="color: #475467; font-size: 15px; line-height: 1.7; white-space: pre-line; margin: 0;">{{ event.description }}</p>
          </div>
        </div>

        <!-- Right: Registration Status -->
        <div nz-col [nzXs]="24" [nzLg]="8">
          <div style="background: #fff; border-radius: 12px; border: 1px solid #eaecf0; padding: 24px; position: sticky; top: 100px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #101828; margin-bottom: 20px;">Registration Status</h3>

            <div style="background: #f0f7ff; border-radius: 8px; padding: 16px; margin-bottom: 24px; border: 1px solid #e6f4ff;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; color: #1890ff; font-weight: 600;">
                <span>Capacity</span>
                <span>{{ getProgressPercentage() }}% Full</span>
              </div>
              <nz-progress [nzPercent]="getProgressPercentage()" [nzShowInfo]="false" nzSize="small" [nzStrokeColor]="getProgressPercentage() >= 90 ? '#f79009' : '#1890ff'"></nz-progress>
              <div style="color: #667085; font-size: 13px; margin-top: 8px;">
                {{ event.occupiedSeats }} / {{ event.totalSeats }} seats filled
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f2f4f7;">
                <span style="color: #667085; font-size: 14px;">Available Seats</span>
                <span style="color: #101828; font-weight: 600; font-size: 14px;">{{ event.availableSeats }}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span style="color: #667085; font-size: 14px;">Status</span>
                <nz-tag *ngIf="event.isSoldOut" [nzColor]="'error'">Sold Out</nz-tag>
                <nz-tag *ngIf="!event.isSoldOut" [nzColor]="'success'">Available</nz-tag>
              </div>
            </div>
          </div>
        </div>
      </nz-row>

      <!-- Attendees Table -->
      <nz-card nzTitle="Registered Attendees" style="border-radius: 12px; border: 1px solid #eaecf0;">
        <div style="margin-bottom: 16px; display: flex; justify-content: flex-end; align-items: center;">
          <span style="margin-right: 8px;">Show Checked-in Only:</span>
          <nz-switch [(ngModel)]="showCheckedInOnly" (ngModelChange)="filterAttendees()"></nz-switch>
        </div>

        <nz-table #attendeeTable [nzData]="filteredAttendees" nzTableLayout="fixed" [nzPageSize]="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Registration Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of attendeeTable.data">
              <td>{{ data.userName }}</td>
              <td>{{ data.userEmail }}</td>
              <td>{{ data.registrationDate | date:'medium' }}</td>
              <td>
                <nz-tag *ngIf="data.isCheckedIn" [nzColor]="'green'"><span nz-icon nzType="check-circle"></span> Checked In</nz-tag>
                <nz-tag *ngIf="!data.isCheckedIn" [nzColor]="'orange'">Pending</nz-tag>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </nz-card>
    </ng-container>
  `
})
export class EventDetailsComponent implements OnInit {
  event: EventDetail | null = null;
  allAttendees: any[] = [];
  filteredAttendees: any[] = [];
  
  isLoading = true;
  showCheckedInOnly = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEventDetails(id);
    } else {
      this.message.error('Invalid event ID');
      this.isLoading = false;
    }
  }

  loadEventDetails(id: string): void {
    this.eventService.getEventDetails(id).subscribe({
      next: (data) => {
        this.event = data;
        this.allAttendees = data.attendees;
        this.filteredAttendees = [...this.allAttendees];
        this.isLoading = false;
      },
      error: () => {
        this.message.error('Failed to load event details.');
        this.isLoading = false;
      }
    });
  }

  filterAttendees(): void {
    if (this.showCheckedInOnly) {
      this.filteredAttendees = this.allAttendees.filter(a => a.isCheckedIn);
    } else {
      this.filteredAttendees = [...this.allAttendees];
    }
  }

  getProgressPercentage(): number {
    if (!this.event || this.event.totalSeats === 0) return 0;
    return Math.round((this.event.occupiedSeats / this.event.totalSeats) * 100);
  }
}
