import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chat-text-box',
  templateUrl: './chat-text-box.component.html',
  styleUrls: ['./chat-text-box.component.scss']
})
export class ChatTextBoxComponent implements OnInit {
  /**
   * Determines if the new message box is in edit mode or not
   */
  froalaBoxEditMode: boolean = false;
  messageText: string = "";

  @Output("submit") submitMessage:EventEmitter<string> = new EventEmitter();


  constructor() { }

  ngOnInit() {
  }


  sendMessage() {
    this.submitMessage.emit(this.messageText);
    this.messageText = "";
  }

}
