import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DecodedToken } from 'src/data/dtos/decodedtoken';
import { Message } from 'src/data/dtos/message';
import { UserForReturn } from 'src/data/dtos/user';
import { AuthService } from 'src/services/auth.service';
import { MessagingService } from 'src/services/messaging.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss'],
})
export class MessagingComponent implements OnInit {
  userDetails: DecodedToken;
  /**
   * Set when a chat item is clicked.. Holds the item clicked;
   */
  activeChatItem: UserForReturn;

  messages: Message[] = [];

  shouldChatPaneScrollToEnd = true;
  chatPagePreviousScrollTop = 0;

  doingBlockWork = false;

  /**
   * Keeps track of chat rooms that have been already clicked on 
   * Because on initial click we load all chats for the room
   */
  alreadyOpenedRooms = [];
  @ViewChild('activeChatsPane', { static: true }) activeChatsPane: ElementRef;

  constructor(
    public messagingService: MessagingService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userDetails = authService.decodedToken;
    this.messagingService.newMesageRecieved.subscribe(() => {
      if (this.activeChatItem?.id)
        this.getMessages(this.activeChatItem?.id);
    });

    this.messagingService.newUsersArrived.subscribe(()=>{
      console.log("New Users Arrived");
      this.doingBlockWork = false;
      if(this.activeChatItem){
        let list = messagingService.usersList.filter(i=>i.id == this.activeChatItem.id);

        if(list.length > 0){
          this.activeChatItem = list[0];
          console.log("ActiveChatItem",this.activeChatItem);
        }else{
          this.activeChatItem = null;
        }

      }
    });
  }

  ngOnInit() {}

  ngAfterViewChecked() {
    if (this.shouldChatPaneScrollToEnd)
      this.scrollToEnd(this.activeChatsPane?.nativeElement);
  }
  /**
   * Called when a chat Item is clicked
   * @param item The item returned from the click event
   * @param type The type of item
   */
  chatItemClicked(item: UserForReturn) {
    this.activeChatItem = item;
    this.getMessages(item.id);
    this.shouldChatPaneScrollToEnd = true;
  }

  chatPageScrolled(event) {
    // console.log(event);
    var st = event.target?.scrollTop;
    //Detect scroll to top and disable autoScrollToEnd;
    if (st < this.chatPagePreviousScrollTop)
      this.shouldChatPaneScrollToEnd = false;

    this.chatPagePreviousScrollTop = st <= 0 ? 0 : st;
  }

  /**
   * Send a single message to the server and adds it to the message List
   */
  sendMessage(messageText) {
    // debugger;
    if (messageText == null) return;
    this.messagingService.sendMessage(messageText, this.activeChatItem?.id);

    //this.messageText = null;
    this.shouldChatPaneScrollToEnd = true;
  }

  /**
   * Get Messages from the backend on initial load
   */
  getMessages(receiverId: string) {
    if(this.alreadyOpenedRooms.includes(receiverId)){
      this.messages = this.messagingService.getRoomMessages(receiverId);
    }else{
      this.messages = [];
      this.alreadyOpenedRooms.push(receiverId);
      this.messagingService.GetInitialMessagesBetweenTwoParty(receiverId);
    }
  }

  /**
   * Sets a callbackt to be called when the chat messages change
   */
  setConsumerCallback() {}

  scrollToEnd(element) {
    if (element) element.scrollTop = Number.MAX_SAFE_INTEGER;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  blockUser(userToBlockId){
    this.doingBlockWork = true;
    this.messagingService.blockUser(userToBlockId);
  }

  UnblockUser(userToUnblockId){
    this.doingBlockWork = true;
    this.messagingService.unBlockUser(userToUnblockId);

  }
}
