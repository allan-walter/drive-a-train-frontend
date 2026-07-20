import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonOverlay } from './button-overlay';

describe('ButtonOverlay', () => {
  let component: ButtonOverlay;
  let fixture: ComponentFixture<ButtonOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonOverlay],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonOverlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
