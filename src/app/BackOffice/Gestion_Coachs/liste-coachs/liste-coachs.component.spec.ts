import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachListComponent } from './liste-coachs.component';

describe('ListeCoachsComponent', () => {
  let component: CoachListComponent;
  let fixture: ComponentFixture<CoachListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoachListComponent]
    });
    fixture = TestBed.createComponent(CoachListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
