import { Injectable } from '@angular/core';


@Injectable()
export class NotificationService{
    notifications:string[] = [];

    showNotification(message){
        this.notifications.push(message);
        setTimeout(() => {
            var index = this.notifications.length - 1;
            this.removeNotification(index);
        }, 5000);
    }

    removeNotification(index){
       this.notifications.splice(index,1);
    }
}