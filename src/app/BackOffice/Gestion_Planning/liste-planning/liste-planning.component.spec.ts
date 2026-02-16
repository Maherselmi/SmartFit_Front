import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePlanningComponent } from './liste-planning.component';

describe('ListePlanningComponent', () => {
  let component: ListePlanningComponent;
  let fixture: ComponentFixture<ListePlanningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListePlanningComponent]
    });
    fixture = TestBed.createComponent(ListePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
