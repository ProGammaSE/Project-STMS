import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketingPageComponent } from './ticketing-page.component';

describe('TicketingPageComponent', () => {
  let component: TicketingPageComponent;
  let fixture: ComponentFixture<TicketingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
