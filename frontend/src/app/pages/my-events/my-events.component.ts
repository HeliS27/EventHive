import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RegistrationService, Registration } from '../../core/services/registration.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, RouterLink, NzCardModule, NzGridModule, NzTagModule, NzButtonModule, NzIconModule, NzEmptyModule, NzSpinModule, NzPopconfirmModule, NzModalModule],
  template: `
    <div class="my-events-page">
      <div class="page-header">
        <div>
          <h1>My Registered Events</h1>
          <p>Show your event QR code at the registration desk to check in.</p>
        </div>
        <a routerLink="/events" class="browse-btn">
          <span nz-icon nzType="search"></span> Browse Events
        </a>
      </div>

      <div *ngIf="isLoading" style="text-align: center; margin: 60px 0;">
        <nz-spin nzSimple nzSize="large"></nz-spin>
      </div>

      <nz-empty *ngIf="!isLoading && registrations.length === 0"
        nzNotFoundContent="You haven't registered for any events yet."
        style="margin: 60px 0;">
      </nz-empty>

      <div *ngIf="!isLoading" class="cards-grid">
        <div *ngFor="let reg of registrations; let i = index" class="ticket-card">
          <!-- Card Header -->
          <div class="ticket-top">
            <div>
              <h3 class="ticket-title">{{ reg.eventTitle }}</h3>
              <nz-tag [nzColor]="getCategoryColor(reg.eventCategory)" style="border-radius: 6px; font-weight: 500; margin-top: 4px;">{{ reg.eventCategory }}</nz-tag>
            </div>
          </div>

          <!-- Dashed separator -->
          <div class="ticket-divider"></div>

          <!-- Card Body -->
          <div class="ticket-body">
            <div class="ticket-info">
              <div class="info-row">
                <span class="info-label"><span nz-icon nzType="number" style="margin-right: 4px;"></span> Registration ID</span>
                <span class="info-value mono">{{ reg.id | slice:0:18 }}...</span>
              </div>
              <div class="info-row">
                <span class="info-label"><span nz-icon nzType="calendar" style="margin-right: 4px;"></span> Event Date</span>
                <span class="info-value">{{ reg.eventDate | date:'mediumDate' }} at {{ reg.eventDate | date:'shortTime' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label"><span nz-icon nzType="clock-circle" style="margin-right: 4px;"></span> Registered On</span>
                <span class="info-value">{{ reg.registrationDate | date:'mediumDate' }}</span>
              </div>
            </div>
            <div class="qr-box">
              <img [src]="qrCodes[i]" alt="QR Code" *ngIf="qrCodes[i]" />
              <div *ngIf="!qrCodes[i]" class="qr-placeholder">
                <span nz-icon nzType="loading" style="font-size: 18px;"></span>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="ticket-footer" [class.checked-in]="reg.isCheckedIn">
            <div class="status-text">
              <span *ngIf="!reg.isCheckedIn" nz-icon nzType="clock-circle" nzTheme="outline" style="color: #d97706; margin-right: 6px;"></span>
              <span *ngIf="!reg.isCheckedIn" style="color: #d97706; font-weight: 600;">Pending Check-in</span>
              
              <span *ngIf="reg.isCheckedIn" nz-icon nzType="check-circle" nzTheme="fill" style="color: #16a34a; margin-right: 6px;"></span>
              <span *ngIf="reg.isCheckedIn" style="color: #16a34a; font-weight: 600;">Checked In</span>
            </div>
            <button 
              *ngIf="!reg.isCheckedIn"
              nz-button 
              nzSize="small"
              nzDanger
              (click)="showCancelConfirm(reg)"
              style="border-radius: 6px; font-weight: 500;">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .my-events-page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 8px 0;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
    }
    .page-header h1 {
      font-size: 24px;
      font-weight: 800;
      color: #101828;
      margin-bottom: 4px;
    }
    .page-header p {
      color: #667085;
      font-size: 14px;
      margin: 0;
    }
    .browse-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      background: #eff6ff;
      color: #1d4ed8;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      transition: background 0.2s;
    }
    .browse-btn:hover {
      background: #dbeafe;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 20px;
    }
    .ticket-card {
      background: #fff;
      border-radius: 14px;
      border: 1px solid #eaecf0;
      overflow: hidden;
      transition: box-shadow 0.2s;
    }
    .ticket-card:hover {
      box-shadow: 0 8px 24px rgba(29, 78, 216, 0.08);
    }
    .ticket-top {
      padding: 20px 24px 16px;
    }
    .ticket-title {
      font-size: 17px;
      font-weight: 700;
      color: #101828;
      margin-bottom: 0;
    }
    .ticket-divider {
      border-top: 2px dashed #eaecf0;
      margin: 0 24px;
    }
    .ticket-body {
      padding: 16px 24px 20px;
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }
    .ticket-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .info-row {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .info-label {
      font-size: 12px;
      font-weight: 600;
      color: #475467;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .info-value {
      font-size: 14px;
      color: #101828;
      font-weight: 500;
    }
    .info-value.mono {
      font-family: monospace;
      font-size: 12px;
      color: #667085;
    }
    .qr-box {
      width: 90px;
      height: 90px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qr-box img {
      width: 90px;
      height: 90px;
      border: 1px solid #eaecf0;
      border-radius: 8px;
      padding: 4px;
      background: #fff;
    }
    .qr-placeholder {
      width: 90px;
      height: 90px;
      background: #f9fafb;
      border: 1px solid #eaecf0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #98a2b3;
    }
    .ticket-footer {
      padding: 12px 24px;
      background: #fffbeb;
      border-top: 1px solid #fde68a;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .ticket-footer.checked-in {
      background: #f0fdf4;
      border-top-color: #bbf7d0;
    }
    .status-text {
      display: flex;
      align-items: center;
      font-size: 14px;
    }
  `]
})
export class MyEventsComponent implements OnInit {
  registrations: Registration[] = [];
  qrCodes: string[] = [];
  isLoading = true;

  constructor(
    private registrationService: RegistrationService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.loadMyRegistrations();
  }

  getCategoryColor(category: string): string {
    const map: Record<string, string> = {
      'Workshop': 'blue',
      'Hackathon': 'purple',
      'Seminar': 'cyan',
    };
    return map[category] || 'default';
  }

  loadMyRegistrations(): void {
    this.registrationService.getMyEvents().subscribe({
      next: (data) => {
        this.registrations = data;
        this.generateQRCodes();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching registrations', err);
        this.isLoading = false;
      }
    });
  }

  async generateQRCodes() {
    this.qrCodes = new Array(this.registrations.length).fill('');
    for (let i = 0; i < this.registrations.length; i++) {
      try {
        const qrDataUrl = await QRCode.toDataURL(this.registrations[i].id, {
          width: 200,
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' }
        });
        this.qrCodes[i] = qrDataUrl;
      } catch (err) {
        console.error('Failed to generate QR code', err);
      }
    }
  }

  showCancelConfirm(reg: Registration): void {
    this.modal.confirm({
      nzTitle: 'Cancel Registration',
      nzContent: `<div style="font-size: 16px; color: #101828; margin-bottom: 0;">
        Are you sure you want to cancel your registration for <strong>"${reg.eventTitle}"</strong>?
        <br />
        <span style="color: #667085; font-size: 15px; margin-top: 8px; display: inline-block;">This action cannot be undone. You will lose your spot in this event.</span>
      </div>`,
      nzOkText: 'Cancel Registration',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Keep Registration',
      nzIconType: 'exclamation-circle',
      nzOnOk: () => this.cancelRegistration(reg.eventId)
    });
  }

  cancelRegistration(eventId: string): void {
    this.registrationService.cancelRegistration(eventId).subscribe({
      next: () => {
        this.message.success('Registration cancelled successfully.');
        this.loadMyRegistrations();
      },
      error: (err) => {
        this.message.error(err.error?.message || 'Failed to cancel registration.');
      }
    });
  }
}
