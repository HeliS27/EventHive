import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService, Event } from '../../../core/services/event.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-event-manager',
  standalone: true,
  imports: [CommonModule, RouterLink, NzTableModule, NzButtonModule, NzIconModule, NzTagModule, NzToolTipModule, NzModalModule],
  template: `
    <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 style="font-size: 22px; font-weight: 700; color: #101828; margin-bottom: 4px;">Event Manager</h2>
        <p style="color: #667085; font-size: 14px; margin: 0;">Manage all events, view details, or create new ones.</p>
      </div>
      <button nz-button nzType="primary" routerLink="/admin/events/new" style="background: #1d4ed8; border-color: #1d4ed8; border-radius: 8px; height: 40px; font-weight: 600; display: flex; align-items: center; gap: 6px;">
        <span nz-icon nzType="plus"></span> Create New Event
      </button>
    </div>

    <div style="background: #fff; border-radius: 12px; border: 1px solid #eaecf0; overflow: hidden;">
      <nz-table #eventTable [nzData]="events" [nzLoading]="isLoading" nzTableLayout="fixed" [nzPageSize]="10" [nzShowSizeChanger]="false">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="font-weight: 600; color: #475467; font-size: 13px;">Title</th>
            <th style="font-weight: 600; color: #475467; font-size: 13px;">Date</th>
            <th style="font-weight: 600; color: #475467; font-size: 13px;">Category</th>
            <th style="font-weight: 600; color: #475467; font-size: 13px;">Venue</th>
            <th style="font-weight: 600; color: #475467; font-size: 13px;">Price</th>
            <th style="font-weight: 600; color: #475467; font-size: 13px;">Capacity</th>
            <th style="font-weight: 600; color: #475467; font-size: 13px;">Status</th>
            <th style="font-weight: 600; color: #475467; font-size: 13px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let data of eventTable.data">
            <td style="font-weight: 600; color: #101828;">{{ data.title }}</td>
            <td style="color: #475467;">{{ data.eventDate | date:'mediumDate' }}</td>
            <td>
              <nz-tag [nzColor]="getCategoryColor(data.category)" style="border-radius: 6px; font-weight: 500;">{{ data.category }}</nz-tag>
            </td>
            <td style="color: #475467;">{{ data.venue || '—' }}</td>
            <td style="color: #475467;">{{ data.price | currency:'INR' }}</td>
            <td>
              <span style="color: #1d4ed8; font-weight: 600;">{{ data.occupiedSeats }}</span>
              <span style="color: #98a2b3;"> / {{ data.totalSeats }}</span>
            </td>
            <td>
              <nz-tag *ngIf="data.isSoldOut" nzColor="error" style="border-radius: 6px; font-weight: 500;">Sold Out</nz-tag>
              <nz-tag *ngIf="!data.isSoldOut" nzColor="success" style="border-radius: 6px; font-weight: 500;">Available</nz-tag>
            </td>
            <td>
              <div style="display: flex; gap: 8px; align-items: center;">
                <a [routerLink]="['/admin/events', data.id, 'details']"
                   nz-tooltip nzTooltipTitle="View Details"
                   style="width: 32px; height: 32px; border-radius: 8px; background: #eff6ff; display: flex; align-items: center; justify-content: center; color: #1d4ed8; font-size: 15px;">
                  <span nz-icon nzType="eye" nzTheme="outline"></span>
                </a>
                <a [routerLink]="['/admin/events', data.id, 'edit']"
                   nz-tooltip nzTooltipTitle="Edit Event"
                   style="width: 32px; height: 32px; border-radius: 8px; background: #f0fdf4; display: flex; align-items: center; justify-content: center; color: #16a34a; font-size: 15px;">
                  <span nz-icon nzType="edit" nzTheme="outline"></span>
                </a>
                <a (click)="showDeleteConfirm(data)"
                   nz-tooltip nzTooltipTitle="Delete Event"
                   style="width: 32px; height: 32px; border-radius: 8px; background: #fef2f2; display: flex; align-items: center; justify-content: center; color: #ef4444; font-size: 15px; cursor: pointer;">
                  <span nz-icon nzType="delete" nzTheme="outline"></span>
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </div>
  `
})
export class EventManagerComponent implements OnInit {
  events: Event[] = [];
  isLoading = true;

  constructor(
    private eventService: EventService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      },
      error: () => {
        this.message.error('Failed to load events.');
        this.isLoading = false;
      }
    });
  }

  showDeleteConfirm(event: Event): void {
    this.modal.confirm({
      nzTitle: 'Delete Event',
      nzContent: `<div style="font-size: 16px; color: #101828; margin-bottom: 0;">
        Are you sure you want to delete <strong>"${event.title}"</strong>?
        <br />
        <span style="color: #ef4444; font-size: 15px; margin-top: 8px; display: inline-block;">This action cannot be undone. All registrations associated with this event will also be removed.</span>
      </div>`,
      nzOkText: 'Delete Event',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzIconType: 'exclamation-circle',
      nzOnOk: () => this.deleteEvent(event.id)
    });
  }

  getCategoryColor(category: string): string {
    const map: Record<string, string> = {
      'Workshop': 'blue',
      'Hackathon': 'purple',
      'Seminar': 'cyan'
    };
    return map[category] || 'default';
  }

  deleteEvent(id: string): void {
    this.eventService.delete(id).subscribe({
      next: () => {
        this.message.success('Event deleted successfully.');
        this.events = this.events.filter(e => e.id !== id);
      },
      error: () => {
        this.message.error('Failed to delete event. Ensure no users are registered to it.');
      }
    });
  }
}
