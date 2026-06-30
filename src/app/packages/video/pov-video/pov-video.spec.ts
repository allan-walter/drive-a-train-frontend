import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PovVideo } from './pov-video';

describe('PovVideo', () => {
  let component: PovVideo;
  let fixture: ComponentFixture<PovVideo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PovVideo],
    }).compileComponents();

    fixture = TestBed.createComponent(PovVideo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
