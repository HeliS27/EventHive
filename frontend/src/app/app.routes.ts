import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { EventDiscoveryComponent } from './pages/event-discovery/event-discovery.component';
import { EventRegistrationComponent } from './pages/event-registration/event-registration.component';
import { MyEventsComponent } from './pages/my-events/my-events.component';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { EventManagerComponent } from './pages/admin/event-manager/event-manager.component';
import { EventFormComponent } from './pages/admin/event-form/event-form.component';
import { AttendeesComponent } from './pages/admin/attendees/attendees.component';
import { AnalyticsComponent } from './pages/admin/analytics/analytics.component';
import { EventDetailsComponent } from './pages/admin/event-details/event-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'events', component: EventDiscoveryComponent, canActivate: [authGuard] },
  { path: 'events/:id/register', component: EventRegistrationComponent, canActivate: [authGuard] },
  { path: 'my-events', component: MyEventsComponent, canActivate: [authGuard] },
  
  // Admin Routes protected by Admin Guard
  { 
    path: 'admin', 
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'analytics', pathMatch: 'full' },
      { path: 'analytics', component: AnalyticsComponent, canActivate: [authGuard] },
      { path: 'events', component: EventManagerComponent, canActivate: [authGuard] },
      { path: 'events/new', component: EventFormComponent, canActivate: [authGuard] },
      { path: 'events/:id/edit', component: EventFormComponent, canActivate: [authGuard] },
      { path: 'events/:id/details', component: EventDetailsComponent, canActivate: [authGuard] },
      { path: 'attendees', component: AttendeesComponent, canActivate: [authGuard] }
    ]
  },
  
  { path: '**', redirectTo: '' }
];
