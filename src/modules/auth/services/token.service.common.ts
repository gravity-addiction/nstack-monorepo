import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/index';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenServiceCommon {
  public authTokenId!: string; // _AID - Current auth token to send to server
  public authCollectionId!: string; // _VPS - identifier for store prefix of session tokens
  public authCollectionPersistId!: string; // _VPP - identifier for store prefix of persistant tokens

  public loginToken$!: BehaviorSubject<any[]>; // Holds array of filled login tokens
  public authActiveIdent$!: BehaviorSubject<string>; // Identifier for the action login token ident
  public authActive$!: BehaviorSubject<any>; // User JSON of active user

  public cookiesEnabled = false;
  public persistEnabled = true;

  constructor(public configService: ConfigService) {
    // console.log('Token Service Common');
    this.authTokenId = this.configService.config.authTokenKey || '_AID';
    this.authCollectionId = this.configService.config.authCollectionKey || '_VPS';
    this.authCollectionPersistId = this.configService.config.authCollectionPersistId || '_VPP';

    this.loginToken$ = new BehaviorSubject<any>([]);
    this.authActiveIdent$ = new BehaviorSubject<string>('');
    this.authActive$ = new BehaviorSubject<any>({});
  }

  // Returns true if expired
  isExpired(tokenJson: any) {
    if (!tokenJson) {
      return true;
    }
    const authExp = tokenJson.hasOwnProperty('exp') ? parseInt(tokenJson.exp, 10) || 0 : 0;
    return (Date.now() >= authExp * 1000);
  }

  // Returns false if expired
  notExpired(tokenJson: any) {
    return !(this.isExpired(tokenJson));
  }

  getLoginJson(authIdent: string) {
    // console.log('getLoginJson()', authIdent);
    const loginTokens = this.loginToken$.value || [];
    const lInd = loginTokens.findIndex((t: any) => (t && t.ident === authIdent));
    // console.log('Found', lInd);
    if (lInd > -1) {
      return loginTokens[lInd];
    }
  }

  setActiveJson(authInfo: any) {
    // console.log('Settings', authInfo);
    this.authActive$.next(authInfo || {});
  }

  hasActiveToken(): boolean {
    // console.log('hasActiveToken()');
    const tokenJson = this.authActive$.value || {};
    return this.notExpired(tokenJson);
  }

  setActiveIdent(authIdent: string) {
    const userInfo = this.getLoginJson(authIdent || '') || {};
    userInfo.ident = authIdent;
    this.setActiveJson(userInfo);
  }

  // Parse Auth JSON String into authJson
  toUserInfo(authString: string): any {
    if (!authString) {
      return {};
    }

    let authJson = {};
    try {
      const authParsed = JSON.parse(authString);
      if (Object.keys(authParsed).length) {
        authJson = Object.assign({}, authParsed);
      }
    } catch (e) {
      authJson = {};
    }

    return authJson;
  }


  // Store identifier functions
  // Create a random identifier key
  makeAuthIdent(length = 8) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // Build actual store key based on collectionid and ident
  makeIdentKey(ident: string, persist = false) {
    return (persist ? this.authCollectionPersistId : this.authCollectionId) + '_' + ident;
  }

}
