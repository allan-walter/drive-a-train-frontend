import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Markers } from './markers';

describe('Markers', () => {
  let component: Markers;
  let fixture: ComponentFixture<Markers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Markers],
    }).compileComponents();

    fixture = TestBed.createComponent(Markers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
