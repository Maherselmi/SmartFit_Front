import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAbonnementsComponent } from './liste-abonnements.component';

describe('ListeAbonnementsComponent', () => {
  let component: ListeAbonnementsComponent;
  let fixture: ComponentFixture<ListeAbonnementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeAbonnementsComponent]
    });
    fixture = TestBed.createComponent(ListeAbonnementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
