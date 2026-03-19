import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NzLayoutModule, NzMenuModule, CommonModule, RouterLink, NzButtonModule, NzIconModule],
  template: `
    <nz-layout class="layout">
      <nz-header class="custom-header">
        <div class="logo-container">
          <span nz-icon nzType="thunderbolt" nzTheme="fill" style="color: #1890ff; font-size: 24px;"></span>
          <span class="logo-text">EventHive</span>
        </div>
        <ul nz-menu nzTheme="light" nzMode="horizontal" class="nav-menu">
          <li nz-menu-item routerLink="/" style="color: var(--white)">Home</li>
          <ng-container *ngIf="!authService.isAuthenticated()">
            <li nz-menu-item routerLink="/login" class="nav-right" style="color: var(--white); margin-left: auto;">Login</li>
            <li nz-menu-item routerLink="/register" class="nav-right" style="padding: 0; color: var(--white)">
              <button nz-button nzType="primary" style="border-radius: 4px; border: none; font-weight: 500; background: var(--primary-color); color: var(--white); margin-left: 12px;">Sign In</button>
            </li>
          </ng-container>
          <ng-container *ngIf="authService.isAuthenticated() && !authService.isAdmin()">
            <li nz-menu-item routerLink="/events" style="color: var(--white)">All Events</li>
            <li nz-menu-item routerLink="/my-events" style="color: var(--white)">My Events</li>
            <li nz-menu-item (click)="logout()" style="float: right; color: var(--white)">Logout</li>
            <li nz-menu-item style="float: right; cursor: default">
              <span style="color: #1890ff">Hello, {{ authService.currentUserValue?.fullName }}</span>
            </li>
          </ng-container>
          <ng-container *ngIf="authService.isAuthenticated() && authService.isAdmin()">
            <li nz-menu-item routerLink="/admin/events" style="color: var(--white)">Manage Events</li>
            <li nz-menu-item routerLink="/admin/attendees" style="color: var(--white)">Attendees / Check-in</li>
            <li nz-menu-item routerLink="/admin/analytics" style="color: var(--white)">Analytics</li>
            <li nz-menu-item (click)="logout()" style="float: right; color: var(--white)">Logout</li>
            <li nz-menu-item style="float: right; cursor: default">
              <span style="color: #1890ff">Hello, {{ authService.currentUserValue?.fullName }}</span>
            </li>
          </ng-container>
        </ul>
      </nz-header>
      <nz-content>
        <div class="inner-content">
          <router-outlet></router-outlet>
        </div>
      </nz-content>
      <nz-footer class="custom-footer">
        <div class="footer-left">
          <span>© 2026 EventHive</span>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <div class="footer-right">
          <span nz-icon nzType="global" style="margin-right: 6px;"></span>
          English (US)
        </div>
      </nz-footer>
    </nz-layout>
  `,
  styles: [`
    .custom-header {
      background: #ffffff;
      padding: 0 50px;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 8px #f0f1f2;
      border-bottom: 1px solid #f0f0f0;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .logo-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo-text {
      color: #1890ff;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .nav-menu {
      line-height: 64px;
      border-bottom: none;
      flex-grow: 1;
      justify-content: flex-end;
      display: flex;
      background: transparent;
    }
    .nav-menu .ant-menu-item {
      font-weight: 500;
      color: #333;
    }
    
    .custom-footer {
      background: #fff;
      border-top: 1px solid #eaecf0;
      padding: 16px 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #98a2b3;
    }
    .footer-left {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .footer-left a {
      color: #667085;
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-left a:hover {
      color: #1890ff;
    }
    .footer-right {
      display: flex;
      align-items: center;
      color: #667085;
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}
