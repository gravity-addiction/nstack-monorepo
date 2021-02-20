import { Injectable } from '@angular/core';
// import { firebase } from '@nativescript/firebase';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  public token = '';
  constructor() { }

  init(): Promise<any> {
    return Promise.resolve(null);
    /*
    return firebase.init({
      showNotifications: true,
      showNotificationsWhenInForeground: true,

      onPushTokenReceivedCallback: (token) => {
        this.token = token;
        // console.log('[Firebase] onPushTokenReceivedCallback:', { token });
      },

      onMessageReceivedCallback: (message: firebase.Message) => {
        // console.log('[Firebase] onMessageReceivedCallback:', { message });
      }
    });
    */
  }
}
