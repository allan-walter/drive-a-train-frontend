import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sizer } from './sizer';

describe('Sizer', () => {
  let component: Sizer;
  let fixture: ComponentFixture<Sizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sizer],
    }).compileComponents();

    fixture = TestBed.createComponent(Sizer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
