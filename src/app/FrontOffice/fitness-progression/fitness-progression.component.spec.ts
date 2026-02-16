import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitnessProgressionComponent } from './fitness-progression.component';

describe('FitnessProgressionComponent', () => {
  let component: FitnessProgressionComponent;
  let fixture: ComponentFixture<FitnessProgressionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FitnessProgressionComponent]
    });
    fixture = TestBed.createComponent(FitnessProgressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
