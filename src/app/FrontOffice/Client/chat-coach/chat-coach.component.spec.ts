import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatCoachComponent } from './chat-coach.component';

describe('ChatCoachComponent', () => {
  let component: ChatCoachComponent;
  let fixture: ComponentFixture<ChatCoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatCoachComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
