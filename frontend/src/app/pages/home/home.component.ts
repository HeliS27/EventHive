import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { EventService, Event } from '../../core/services/event.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NzButtonModule, NzIconModule, NzStatisticModule, NzTagModule, NzSpinModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  totalEvents = 0;
  totalSeats = 0;
  categories: string[] = [];
  upcomingEvents: Event[] = [];
  loading = true;

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit() {
    this.eventService.getAll().subscribe({
      next: (events) => {
        this.totalEvents = events.length;
        this.totalSeats = events.reduce((sum, e) => sum + e.totalSeats, 0);
        this.categories = [...new Set(events.map(e => e.category))];
        this.upcomingEvents = events.slice(0, 3);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  getTagColor(category: string): string {
    const map: Record<string, string> = {
      'Workshop': 'blue',
      'Hackathon': 'purple',
      'Seminar': 'cyan',
    };
    return map[category] || 'default';
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
