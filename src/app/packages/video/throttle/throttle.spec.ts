import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Throttle } from './throttle';

describe('Throttle', () => {
  let component: Throttle;
  let fixture: ComponentFixture<Throttle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Throttle],
    }).compileComponents();

    fixture = TestBed.createComponent(Throttle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
