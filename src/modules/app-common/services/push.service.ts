import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  public token = '';

  constructor() { }

  init(): Promise<any> {
    return Promise.resolve(null);
  }
}
