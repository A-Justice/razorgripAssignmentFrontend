import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import * as SignalR from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import { Message } from 'src/data/dtos/message';
import { UserForReturn } from 'src/data/dtos/user';
import { settings } from 'src/data/helpers/settings';
import { AuthService } from './auth.service';

@Injectable()
export class MessagingService {
  messagingHubConnection: SignalR.HubConnection;
  messagingHubUrl = `${settings.baseUri}/signalr/messaging`;

  usersList: UserForReturn[] = [];

  messageBank: { [key: string]: Message[] } = {};

  newMesageRecieved: BehaviorSubject<boolean> = new BehaviorSubject(true);
  newUsersArrived: BehaviorSubject<boolean> = new BehaviorSubject(true);

  async start(hub: signalR.HubConnection, successCallback = undefined) {
    try {
      await hub.start();
      if (successCallback) successCallback.call(this);
    } catch (error) {
      window.setTimeout(() => {
        this.start(hub, successCallback);
      }, 5000);
    }
  }

  constructor(private authService: AuthService) {
    let tokenValue;
    let token = authService.getToken();
    if (token !== '') {
      tokenValue = '?token=' + token;
    }
    this.messagingHubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(this.messagingHubUrl + tokenValue, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(SignalR.LogLevel.Debug)
      .build();

    this.start(this.messagingHubConnection, this.wireMessagingHubHandlers);
  }

  wireMessagingHubHandlers() {
    this.initiateRecieveDirectMessage();
    this.initiateRecieveDirectMessages();
    this.initiateUserJoined();
    this.initiateUserLeft();
    this.onConnectionClosed(this.messagingHubConnection);
    
  }

  initiateRecieveDirectMessage() {
    this.messagingHubConnection.on('ReceiveMessage', (message: Message) => {
      console.log('NewMessage', message);

      this.addNewMessageToBank(message);
    });
  }

  initiateRecieveDirectMessages() {
    this.messagingHubConnection.on('ReceiveMessages', (messages: Message[]) => {
      console.log('NewMessage', messages);
      messages.sort((a,b)=>{
        return +a.createdAt - +b.createdAt;
      }).forEach(message => {
        this.addNewMessageToBank(message);
      });
    });
  }

  addNewMessageToBank(message: Message) {
    let compositeKeyOne = `${message.senderId}.${message.receiverId}`;
    let compositeKeyTwo = `${message.receiverId}.${message.senderId}`;

    if (
      !this.messageBank[compositeKeyOne] &&
      !this.messageBank[compositeKeyTwo]
    ) {
      this.messageBank[compositeKeyOne] = [message];
    } else {
      if (this.messageBank[compositeKeyOne]) {
        this.messageBank[compositeKeyOne].push(message);
      } else if (this.messageBank[compositeKeyTwo]) {
        this.messageBank[compositeKeyTwo].push(message);
      }
    }
    this.newMesageRecieved.next(true);
  }

  getRoomMessages(receiverId: string): Message[] {
    let senderId = this.authService.decodedToken.nameid;
    let compositeKeyOne = `${senderId}.${receiverId}`;
    let compositeKeyTwo = `${receiverId}.${senderId}`;
    if (this.messageBank[compositeKeyOne]) {
      return this.messageBank[compositeKeyOne];
    } else if (this.messageBank[compositeKeyTwo]) {
      return this.messageBank[compositeKeyTwo];
    } else {
      return [];
    }
  }

  initiateUserJoined() {
    this.messagingHubConnection.on(
      'UserJoined',
      (function (users: UserForReturn[] = []) {
        // debugger;
        // console.log('THIS',this);

        console.log("Users",users);
        let localId = <string>this.authService.decodedToken?.nameid;
        if (users) {
          let newList = users?.filter((i) => {
            if(!i)return false;
            if(i.id == localId){
              this.authService.currentUser = i;
            }
            if(i.blockedIds.includes(localId)) return false;

            return i.id != localId;
          });
          this.usersList = newList;
          this.newUsersArrived.next(true);
          // console.log('USerslist',this.usersList);
        }
      }).bind(this)
    );
  }

  initiateUserLeft() {
    //   debugger;
    this.messagingHubConnection.on(
      'UserLeft',
      function (users: UserForReturn[] = []) {
        // console.log('THIS',this);
        // console.log("Users",users);
        let localId = <string>this.authService.decodedToken?.nameid;
        if (users) {
          let newList = users?.filter((i) => i.id != localId);
          this.usersList = newList;
          // console.log('USerslist',this.usersList);
        }
      }.bind(this)
    );
  }

  sendMessage(messageText: string, recieverId: string) {
    var message = this.constructMessage(messageText, recieverId);
    this.addNewMessageToBank(message);
    this.messagingHubConnection.invoke('SendMessage', message);
  }

  blockUser(userToBlockId) {
    this.messagingHubConnection.invoke('BlockUser', userToBlockId);
  }

  GetInitialMessagesBetweenTwoParty(userToTextId) {
    let requesterId = this.authService.decodedToken.nameid;
    if(requesterId){
      this.messagingHubConnection.invoke('GetInitialMessagesBetweenTwoParty', requesterId,userToTextId);
    }
  }

  clearRoomMessages(userToTextId){

  }

  unBlockUser(userToUnblockId) {
    this.messagingHubConnection.invoke('UnBlockUser', userToUnblockId);
  }

  onConnectionClosed(connection) {
    connection.onclose(() => {
      console.log('hub Disconnected.. Reconnecting...');
      this.start(connection);
    });
  }

  constructMessage(messageText, receiverId): Message {
    let message: any = new Message({
      senderId: this.authService.decodedToken.nameid,
      textContent: messageText,
      receiverId,
      createdAt: Date.now().toString(),
    });

    return message;
  }
}
