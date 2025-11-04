import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard360Component } from './dashboard-360.component';

describe('Dashboard360Component', () => {
  let component: Dashboard360Component;
  let fixture: ComponentFixture<Dashboard360Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard360Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dashboard360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
