import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCoachComponent } from './edit-coach.component';

describe('EditCoachComponent', () => {
  let component: EditCoachComponent;
  let fixture: ComponentFixture<EditCoachComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCoachComponent]
    });
    fixture = TestBed.createComponent(EditCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
