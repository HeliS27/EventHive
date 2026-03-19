import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NzLayoutModule],
  template: `
    <nz-layout class="admin-layout">
      <nz-layout>
        <nz-content style="padding: 24px;">
          <router-outlet></router-outlet>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: [`
    .admin-layout {
      background: #f0f2f5;
      min-height: calc(100vh - 133px);
      margin: -24px; /* Counteract inner-content padding */
    }
  `]
})
export class AdminLayoutComponent {}
