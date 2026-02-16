import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachFormComponent } from './add-coach.component';

describe('AddCoachComponent', () => {
  let component: CoachFormComponent;
  let fixture: ComponentFixture<CoachFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoachFormComponent]
    });
    fixture = TestBed.createComponent(CoachFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
