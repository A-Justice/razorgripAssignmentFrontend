import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatTextBoxComponent } from './chat-text-box.component';

describe('ChatTextBoxComponent', () => {
  let component: ChatTextBoxComponent;
  let fixture: ComponentFixture<ChatTextBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatTextBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatTextBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
