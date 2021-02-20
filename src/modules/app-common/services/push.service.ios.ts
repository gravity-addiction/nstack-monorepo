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
    // console.log('Device UUID:', Device.deviceType, Device.os, Device.uuid, Device.language);
    /*
    return firebase.init({
      showNotificationsWhenInForeground: true,
      onMessageReceivedCallback: (message: firebase.Message) => {
        // console.log('Message:', { message });
      },
      onPushTokenReceivedCallback: (token) => {
        this.token = token;
        // console.log("Firebase push token: " + token);
      }
    });
    */
  }
}
