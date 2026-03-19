import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  totalSeats: number;
  occupiedSeats: number;
  category: string;
  durationInDays: number;
  venue: string;
  price: number;
  imageUrl: string;
  isSoldOut: boolean;
  availableSeats: number;
}

export interface Attendee {
  userId: string;
  userName: string;
  userEmail: string;
  isCheckedIn: boolean;
  registrationDate: string;
  registrationId: string;
}

export interface EventDetail extends Event {
  attendees: Attendee[];
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:5000/api/events';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  getEventDetails(id: string): Observable<EventDetail> {
    return this.http.get<EventDetail>(`${this.apiUrl}/${id}/details`);
  }

  create(event: any, imageFile?: File): Observable<Event> {
    const formData = new FormData();
    formData.append('title', event.title);
    formData.append('description', event.description);
    formData.append('category', event.category);
    formData.append('eventDate', event.eventDate);
    formData.append('totalSeats', event.totalSeats.toString());
    formData.append('durationInDays', event.durationInDays.toString());
    formData.append('venue', event.venue);
    formData.append('price', event.price.toString());
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.http.post<Event>(this.apiUrl, formData);
  }

  update(id: string, event: any): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  uploadImage(eventId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${eventId}/upload-image`, formData);
  }
}
