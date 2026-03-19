import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule, NzIconModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">
            <span nz-icon nzType="thunderbolt" nzTheme="fill" style="font-size: 28px; color: #1d4ed8;"></span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your EventHive account</p>
        </div>
        
        <form nz-form [formGroup]="loginForm" nzLayout="vertical" (ngSubmit)="submitForm()">
          <nz-form-item>
            <nz-form-label nzRequired>Email Address</nz-form-label>
            <nz-form-control nzErrorTip="Please input your email!">
              <nz-input-group [nzPrefix]="emailIcon" style="border-radius: 8px;">
                <input type="text" nz-input formControlName="email" placeholder="you@example.com" style="border-radius: 8px; padding: 8px 12px;" />
              </nz-input-group>
              <ng-template #emailIcon><span nz-icon nzType="mail" style="color: #98a2b3;"></span></ng-template>
            </nz-form-control>
          </nz-form-item>
          
          <nz-form-item>
            <nz-form-label nzRequired>Password</nz-form-label>
            <nz-form-control nzErrorTip="Please input your password!">
              <nz-input-group [nzPrefix]="lockIcon" style="border-radius: 8px;">
                <input type="password" nz-input formControlName="password" placeholder="••••••••" style="border-radius: 8px; padding: 8px 12px;" />
              </nz-input-group>
              <ng-template #lockIcon><span nz-icon nzType="lock" style="color: #98a2b3;"></span></ng-template>
            </nz-form-control>
          </nz-form-item>
          
          <button nz-button nzType="primary" [nzLoading]="isLoading" nzBlock class="submit-btn">Sign In</button>
          
          <div class="auth-footer">
            Don't have an account? <a routerLink="/register">Create one</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 180px);
      background: linear-gradient(135deg, #f0f5ff 0%, #e8f0fe 100%);
      padding: 40px 16px;
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 40px 36px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(29, 78, 216, 0.08);
      border: 1px solid #eaecf0;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 28px;
    }
    .auth-logo {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: #eff6ff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    .auth-header h1 {
      font-size: 24px;
      font-weight: 800;
      color: #101828;
      margin-bottom: 4px;
    }
    .auth-header p {
      color: #667085;
      font-size: 14px;
      margin: 0;
    }
    .submit-btn {
      height: 44px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      background: #1d4ed8;
      border-color: #1d4ed8;
      margin-top: 8px;
    }
    .submit-btn:hover {
      background: #1e40af;
      border-color: #1e40af;
    }
    .auth-footer {
      text-align: center;
      margin-top: 20px;
      color: #667085;
      font-size: 14px;
    }
    .auth-footer a {
      color: #1d4ed8;
      font-weight: 600;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  submitForm(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.message.success('Login successful!');
          this.router.navigate(['/']);
          this.isLoading = false;
        },
        error: (err) => {
          this.message.error(err.error?.message || 'Login failed. Please check your credentials.');
          this.isLoading = false;
        }
      });
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
