import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, 
    NzFormModule, NzInputModule, NzButtonModule, 
    NzSelectModule, NzDatePickerModule, NzInputNumberModule,
    NzIconModule, NzGridModule
  ],
  template: `
    <div class="form-page">
      <!-- Page Header -->
      <div class="form-header">
        <h1>{{ isEditMode ? 'Edit Event' : 'Create New Event' }}</h1>
        <p class="subtitle">Provide all the necessary details to publish your technical event to the student portal.</p>
      </div>

      <form nz-form [formGroup]="eventForm" nzLayout="vertical" (ngSubmit)="submitForm()">

        <!-- Section 1: General Information -->
        <div class="form-section">
          <div class="section-title">
            <span nz-icon nzType="info-circle" nzTheme="fill" class="section-icon" style="color: #1d4ed8;"></span>
            <span>General Information</span>
          </div>

          <nz-form-item>
            <nz-form-label nzRequired>Event Title</nz-form-label>
            <nz-form-control nzErrorTip="Please input event title!">
              <input nz-input formControlName="title" placeholder="e.g. National Level Hackathon 2024" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label nzRequired>Description</nz-form-label>
            <nz-form-control nzErrorTip="Please input event description!">
              <textarea nz-input formControlName="description" placeholder="Describe the event, objectives, and rules..." [nzAutosize]="{ minRows: 5, maxRows: 8 }"></textarea>
            </nz-form-control>
          </nz-form-item>

          <div nz-row [nzGutter]="16">
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label nzRequired>Category</nz-form-label>
                <nz-form-control nzErrorTip="Please select category!">
                  <nz-select formControlName="category" nzPlaceHolder="Select Category">
                    <nz-option nzValue="Workshop" nzLabel="Workshop"></nz-option>
                    <nz-option nzValue="Hackathon" nzLabel="Hackathon"></nz-option>
                    <nz-option nzValue="Seminar" nzLabel="Seminar"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label nzRequired>Total Seats</nz-form-label>
                <nz-form-control nzErrorTip="Please define capacity!">
                  <nz-input-number formControlName="totalSeats" [nzMin]="1" [nzMax]="5000" [nzStep]="1" style="width: 100%"></nz-input-number>
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>
        </div>

        <!-- Section 2: Logistics -->
        <div class="form-section">
          <div class="section-title">
            <span nz-icon nzType="environment" nzTheme="fill" class="section-icon" style="color: #1d4ed8;"></span>
            <span>Logistics</span>
          </div>

          <nz-form-item>
            <nz-form-label nzRequired>Venue</nz-form-label>
            <nz-form-control nzErrorTip="Please input event venue!">
              <nz-input-group [nzPrefix]="venueIcon">
                <input nz-input formControlName="venue" placeholder="Main Auditorium / Lab 402" />
              </nz-input-group>
              <ng-template #venueIcon><span nz-icon nzType="bank" style="color: #98a2b3;"></span></ng-template>
            </nz-form-control>
          </nz-form-item>

          <div nz-row [nzGutter]="16">
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label nzRequired>Start Date & Time</nz-form-label>
                <nz-form-control nzErrorTip="Please select date!">
                  <nz-date-picker formControlName="eventDate" nzShowTime nzFormat="MM/dd/yyyy, HH:mm" style="width: 100%" nzPlaceHolder="Select date and time"></nz-date-picker>
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label nzRequired>Duration (Days)</nz-form-label>
                <nz-form-control nzErrorTip="Please specify duration!">
                  <nz-input-number formControlName="durationInDays" [nzMin]="1" [nzMax]="365" [nzStep]="1" style="width: 100%"></nz-input-number>
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>
        </div>

        <!-- Section 3: Pricing & Media -->
        <div class="form-section">
          <div class="section-title">
            <span nz-icon nzType="dollar-circle" nzTheme="fill" class="section-icon" style="color: #1d4ed8;"></span>
            <span>Pricing & Media</span>
          </div>

          <div nz-row [nzGutter]="16">
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label nzRequired>Price (₹)</nz-form-label>
                <nz-form-control nzErrorTip="Please specify price!">
                  <nz-input-number formControlName="price" [nzMin]="0" [nzStep]="1" style="width: 100%" nzPlaceHolder="0 for free events"></nz-input-number>
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>

          <nz-form-item>
            <nz-form-label>Event Banner Image</nz-form-label>
            <nz-form-control>
              <div class="upload-area" (click)="fileInput.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event)">
                <input type="file" #fileInput accept="image/*" (change)="onFileSelected($event)" style="display: none;" />
                <div *ngIf="!imagePreview && !existingImageUrl" class="upload-placeholder">
                  <span nz-icon nzType="cloud-upload" style="font-size: 32px; color: #98a2b3;"></span>
                  <p style="margin: 8px 0 0; color: #667085; font-size: 14px;">Click or drag to upload event banner</p>
                  <p style="margin: 4px 0 0; color: #98a2b3; font-size: 12px;">PNG, JPG up to 5MB</p>
                </div>
                <div *ngIf="imagePreview || existingImageUrl" class="upload-preview">
                  <img [src]="imagePreview || existingImageUrl" alt="Preview" />
                  <div class="preview-overlay">
                    <span nz-icon nzType="edit" style="font-size: 20px; color: #fff;"></span>
                    <span style="color: #fff; font-size: 13px; margin-top: 4px;">Change Image</span>
                  </div>
                </div>
              </div>
              <div *ngIf="selectedFile" style="margin-top: 8px; color: #667085; font-size: 13px;">
                <span nz-icon nzType="paper-clip" style="margin-right: 4px;"></span> {{ selectedFile.name }}
              </div>
            </nz-form-control>
          </nz-form-item>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button nz-button type="button" routerLink="/admin/events" class="cancel-btn">
            <span nz-icon nzType="arrow-left"></span> Cancel
          </button>
          <button nz-button nzType="primary" [nzLoading]="isSubmitting" class="submit-btn">
            <span nz-icon nzType="check"></span> {{ isEditMode ? 'Update Event' : 'Publish Event' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-page {
      max-width: 680px;
      margin: 0 auto;
      padding: 8px 0;
    }
    .form-header h1 {
      font-size: 26px;
      font-weight: 800;
      color: #101828;
      margin-bottom: 4px;
    }
    .subtitle {
      color: #667085;
      font-size: 14px;
      margin-bottom: 28px;
    }
    .form-section {
      background: #fff;
      border: 1px solid #eaecf0;
      border-radius: 12px;
      padding: 24px 28px;
      margin-bottom: 20px;
    }
    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 700;
      color: #101828;
      margin-bottom: 20px;
    }
    .section-icon {
      font-size: 18px;
    }
    .upload-area {
      border: 2px dashed #d0d5dd;
      border-radius: 10px;
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .upload-area:hover {
      border-color: #1d4ed8;
      background: #f0f5ff;
    }
    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .upload-preview {
      position: relative;
      width: 100%;
      max-height: 200px;
      overflow: hidden;
      border-radius: 8px;
    }
    .upload-preview img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-radius: 8px;
    }
    .preview-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
      border-radius: 8px;
    }
    .upload-preview:hover .preview-overlay {
      opacity: 1;
    }
    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      margin-bottom: 32px;
    }
    .cancel-btn {
      border-radius: 8px;
      height: 40px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .submit-btn {
      border-radius: 8px;
      height: 40px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      background: #1d4ed8;
      border-color: #1d4ed8;
    }
    .submit-btn:hover {
      background: #1e40af;
      border-color: #1e40af;
    }
  `]
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  eventId: string | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  existingImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['Workshop', [Validators.required]],
      eventDate: [null, [Validators.required]],
      totalSeats: [50, [Validators.required, Validators.min(1)]],
      durationInDays: [1, [Validators.required, Validators.min(1)]],
      venue: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    if (this.eventId) {
      this.isEditMode = true;
      this.loadEventData(this.eventId);
    }
  }

  loadEventData(id: string): void {
    this.eventService.getById(id).subscribe({
      next: (event) => {
        this.eventForm.patchValue({
          title: event.title,
          description: event.description,
          category: event.category,
          eventDate: new Date(event.eventDate),
          totalSeats: event.totalSeats,
          durationInDays: event.durationInDays || 1,
          venue: event.venue,
          price: event.price,
          imageUrl: event.imageUrl || ''
        });
        if (event.imageUrl) {
          this.existingImageUrl = event.imageUrl;
        }
      },
      error: () => {
        this.message.error('Failed to load event data.');
        this.router.navigate(['/admin/events']);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm(): void {
    if (this.eventForm.valid) {
      this.isSubmitting = true;
      const formData = {
        ...this.eventForm.value,
        eventDate: this.eventForm.value.eventDate.toISOString()
      };

      if (this.isEditMode && this.eventId) {
        this.eventService.update(this.eventId, formData).subscribe({
          next: (result) => {
            if (this.selectedFile) {
              this.eventService.uploadImage(result.id, this.selectedFile).subscribe({
                next: () => {
                  this.message.success('Event updated with image!');
                  this.router.navigate(['/admin/events']);
                },
                error: () => {
                  this.message.warning('Event updated, but image upload failed.');
                  this.router.navigate(['/admin/events']);
                }
              });
            } else {
              this.message.success('Event updated successfully!');
              this.router.navigate(['/admin/events']);
            }
          },
          error: (err) => {
            this.message.error(err.error?.message || 'Operation failed.');
            this.isSubmitting = false;
          }
        });
      } else {
        this.eventService.create(formData, this.selectedFile || undefined).subscribe({
          next: () => {
            this.message.success('Event created successfully!');
            this.router.navigate(['/admin/events']);
          },
          error: (err) => {
            this.message.error(err.error?.message || 'Operation failed.');
            this.isSubmitting = false;
          }
        });
      }
    } else {
      Object.values(this.eventForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
