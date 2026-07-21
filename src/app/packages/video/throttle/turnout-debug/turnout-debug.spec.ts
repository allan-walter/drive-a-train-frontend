import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoutDebug } from './turnout-debug';

describe('TurnoutDebug', () => {
  let component: TurnoutDebug;
  let fixture: ComponentFixture<TurnoutDebug>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoutDebug],
    }).compileComponents();

    fixture = TestBed.createComponent(TurnoutDebug);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
