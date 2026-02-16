import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeNutritionnelleComponent } from './liste-nutritionnelle.component';

describe('ListeNutritionnelleComponent', () => {
  let component: ListeNutritionnelleComponent;
  let fixture: ComponentFixture<ListeNutritionnelleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeNutritionnelleComponent]
    });
    fixture = TestBed.createComponent(ListeNutritionnelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
