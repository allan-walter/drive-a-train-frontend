import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirdsEyeVideo } from './birds-eye-video';

describe('BirdsEyeVideo', () => {
  let component: BirdsEyeVideo;
  let fixture: ComponentFixture<BirdsEyeVideo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirdsEyeVideo],
    }).compileComponents();

    fixture = TestBed.createComponent(BirdsEyeVideo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
