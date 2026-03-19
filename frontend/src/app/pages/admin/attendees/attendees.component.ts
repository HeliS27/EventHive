import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationService, Registration } from '../../../core/services/registration.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-attendees',
  standalone: true,
  imports: [CommonModule, FormsModule, NzTableModule, NzInputModule, NzButtonModule, NzIconModule, NzTagModule],
  template: `
    <div style="margin-bottom: 16px;">
      <h2 style="font-size: 22px; font-weight: 700; color: #101828; margin-bottom: 4px;">Attendees & Check-in</h2>
      <p style="color: #667085; font-size: 14px; margin-bottom: 16px;">Search by student name, email, or event title.</p>
      <nz-input-group [nzPrefix]="prefixIconSearch" style="width: 100%; border-radius: 8px;">
        <input type="text" nz-input placeholder="Search attendees..." [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange($event)" style="border-radius: 8px; padding: 8px 12px; font-size: 14px;" />
      </nz-input-group>
      <ng-template #prefixIconSearch><span nz-icon nzType="search" style="color: #667085;"></span></ng-template>
    </div>

    <nz-table #attendeesTable [nzData]="attendees" [nzLoading]="isLoading" nzTableLayout="fixed" [nzPageSize]="10">
      <thead>
        <tr>
          <th>Student Name</th>
          <th>Email</th>
          <th>Event</th>
          <th>Reg. Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of attendeesTable.data">
          <td>{{ data.userName }}</td>
          <td>{{ data.userEmail }}</td>
          <td>{{ data.eventTitle }}</td>
          <td>{{ data.registrationDate | date:'short' }}</td>
          <td>
            <nz-tag *ngIf="data.isCheckedIn" nzColor="success">Checked In</nz-tag>
            <nz-tag *ngIf="!data.isCheckedIn" nzColor="warning">Pending</nz-tag>
          </td>
          <td>
            <button 
              *ngIf="!data.isCheckedIn"
              nz-button 
              nzSize="small"
              (click)="toggleCheckIn(data)"
              style="background: #12b76a; border-color: #12b76a; color: #fff; border-radius: 6px; font-weight: 600;">
              Check In
            </button>
            <button 
              *ngIf="data.isCheckedIn"
              nz-button 
              nzSize="small"
              (click)="toggleCheckIn(data)"
              style="border-color: #d0d5dd; color: #344054; border-radius: 6px; font-weight: 500;">
              Undo Check-in
            </button>
          </td>
        </tr>
      </tbody>
    </nz-table>
  `
})
export class AttendeesComponent implements OnInit {
  attendees: Registration[] = [];
  isLoading = true;
  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(
    private registrationService: RegistrationService,
    private message: NzMessageService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.loadAttendees(term);
    });
  }

  ngOnInit(): void {
    this.loadAttendees('');
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  loadAttendees(search: string): void {
    this.isLoading = true;
    this.registrationService.getAttendees(search).subscribe({
      next: (data) => {
        this.attendees = data;
        this.isLoading = false;
      },
      error: () => {
        this.message.error('Failed to load attendees.');
        this.isLoading = false;
      }
    });
  }

  toggleCheckIn(reg: Registration): void {
    this.registrationService.toggleCheckIn(reg.id).subscribe({
      next: () => {
        reg.isCheckedIn = !reg.isCheckedIn;
        const status = reg.isCheckedIn ? 'Checked in' : 'Check-in undone';
        this.message.success(`${reg.userName} - ${status}`);
      },
      error: () => {
        this.message.error('Failed to update check-in status.');
      }
    });
  }
}
