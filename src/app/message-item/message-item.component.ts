import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/data/DTOs/message';
import { settings } from 'src/data/helpers/settings';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent implements OnInit {
  settings = settings;
  /**
   * Tells wether the message was sent or recieved
   */
  type = "sent";
  
  @Input() message:Message;

  constructor(private authService:AuthService) { 
   
  }

  ngOnInit() {
    let localId = this.authService.decodedToken.nameid;
    if(localId == this.message.senderId){
      this.type = "sent"
    }else{
      this.type = "recieved";
    }
  }


}
