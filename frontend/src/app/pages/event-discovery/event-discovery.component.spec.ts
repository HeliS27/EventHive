import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDiscoveryComponent } from './event-discovery.component';

describe('EventDiscoveryComponent', () => {
  let component: EventDiscoveryComponent;
  let fixture: ComponentFixture<EventDiscoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDiscoveryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventDiscoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
