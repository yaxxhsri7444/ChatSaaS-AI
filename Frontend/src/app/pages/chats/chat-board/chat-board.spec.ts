import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoard } from './chat-board';

describe('ChatBoard', () => {
  let component: ChatBoard;
  let fixture: ComponentFixture<ChatBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
