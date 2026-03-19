import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  eventCategory: string;
  eventDate: string;
  registrationDate: string;
  isCheckedIn: boolean;
  userName: string;
  userEmail: string;
}

export interface Analytics {
  totalRegistrationsToday: number;
  mostPopularEvent: string;
  capacityFilledPercentage: number;
  totalEvents: number;
  totalStudents: number;
  totalRegistrations: number;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  register(eventId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrations`, { eventId });
  }

  cancelRegistration(eventId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/registrations/${eventId}`);
  }

  getMyEvents(): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.apiUrl}/registrations/my-events`);
  }

  toggleCheckIn(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/registrations/${id}/checkin`, {});
  }

  getAttendees(search: string = ''): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.apiUrl}/admin/attendees?search=${search}`);
  }

  getAnalytics(): Observable<Analytics> {
    return this.http.get<Analytics>(`${this.apiUrl}/admin/analytics`);
  }
}
