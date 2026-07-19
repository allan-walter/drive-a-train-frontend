import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrottleOverlay } from './throttle-overlay';

describe('ThrottleOverlay', () => {
  let component: ThrottleOverlay;
  let fixture: ComponentFixture<ThrottleOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThrottleOverlay],
    }).compileComponents();

    fixture = TestBed.createComponent(ThrottleOverlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
