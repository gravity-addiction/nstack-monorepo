import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/index';
// eslint-disable-next-line max-len
import { setString, remove, getString } from '@nativescript/core/application-settings';
import { atob } from 'atob';
import { CookieService } from 'ngx-cookie-service';

import { TokenServiceCommon } from './token.service.common';

@Injectable({
  providedIn: 'root',
})
export class TokenService extends TokenServiceCommon {

  constructor(configService: ConfigService, private cookieService: CookieService) {
    super(configService);
    // console.log('Token Service Create');
    this.updateAuthCollection();
    this.resetActiveIdent();
  }

  addAuthHeader(authToken: string, headers: any = {}) {
    // console.log('Add Auth Header');
    return headers;
  }


  // single function to update loginTokens
  public updateAuthCollection(): void {
    // console.log('Upadate Auth Collection');
    this.loginToken$.next(this.getAuthCollection() || []);
  }

  ///////////////
  // Token Collections

  // Fetch from store array lists of auth idents
  // returns [persist[], session[]]
  getIdentLists(): [any[], any[]] {
    // console.log('GetIdentLists()');
    const authCollectPersistIdents = getString(this.authCollectionPersistId) || '[]';
    const authCollectSessionIdents = getString(this.authCollectionId) || '[]';

    let arrPersistIdents: any[] = [];
    let arrSessionIdents: any[] = [];

    // Parse collection list
    try {
      arrPersistIdents = JSON.parse(authCollectPersistIdents) || [];

    } catch (e) { }
    try {
      arrSessionIdents = JSON.parse(authCollectSessionIdents) || [];
    } catch (e) { }

    return [arrPersistIdents, arrSessionIdents];
  }

  // Authentication Collections
  getAuthCollection(): any[] {
    // console.log('getAuthCollection()');
    const identLists = this.getIdentLists();
    const arrAuthIdents: any[] = [...identLists[0], ...identLists[1]];

    // console.log('Ident List', identLists);

    // Update login Tokens
    const aLen = arrAuthIdents.length;
    const loginTokens = this.loginToken$.value || [];

    for (let a = 0; a < aLen; a++) {
      const authIdent = arrAuthIdents[a];
      const isPersistToken = (identLists[0].indexOf(authIdent) > -1);

      // Find Existing Ident in loginToken list
      const lInd = loginTokens.findIndex((tokenInd: any) => (tokenInd && tokenInd.ident === authIdent));
      // Leave it alone
      if (lInd > -1) {
        arrAuthIdents[a] = loginTokens[lInd];
        arrAuthIdents[a].persist = isPersistToken;
        continue;
      }

      // Parse to userJson with Garbage collection along the way
      if (!authIdent) {
        this.removeToken(authIdent); arrAuthIdents[a] = null; continue;
      }
      // console.log('Collect', authIdent);
      const token = this.getTokenByIdent(authIdent);
      // console.log('Collected', token);
      if (!token) {
        this.removeToken(authIdent); arrAuthIdents[a] = null; continue;
      }
      const jsonString = this.decodeToken(token);

      if (!jsonString) {
        this.removeToken(authIdent); arrAuthIdents[a] = null; continue;
      }
      const userJson = this.toUserInfo(jsonString);

      // console.log('userJson', userJson);

      // New Entry
      arrAuthIdents[a] = Object.assign({}, { ident: authIdent, expired: this.isExpired(userJson), persist: isPersistToken }, userJson);
    }

    // console.log('Ident Remap', arrAuthIdents);

    // Filter out null entires, actual garbage collection
    let t = 0;
    for (let a = 0; a < aLen; a++) {
      if (arrAuthIdents[a] !== null) {
        arrAuthIdents[t] = arrAuthIdents[a];
        t++;
      }
    }
    arrAuthIdents.length = t;

    return arrAuthIdents; // return auth token collection
  }

  // removes entire collection of tokens from store
  removeTokenCollection(persist = false) {
    // console.log('removeTokenCollection()', persist);
    const identLists = this.getIdentLists();
    const authCollect: any[] = (persist ? identLists[0] : identLists[1]) || [];

    // Remove each known ident from store
    authCollect.forEach((ident: string) => {
      if (!ident || ident === null) {
        return;
      }
      this.removeToken(ident);
    });
    // Remove ident collection
    remove((persist ? this.authCollectionPersistId : this.authCollectionId));
  }










  ///////////
  // Single Tokens

  // get raw token from key ident
  getTokenByIdent(ident: string) {
    // console.log('getTokenByIdent()', ident);
    return getString(this.makeIdentKey(ident, true)) || getString(this.makeIdentKey(ident, false)) || '';
  }
  getActiveToken() {
    // console.log('getActiveToken()');
    return this.getTokenByIdent(this.authActiveIdent$.value) || '';
  }

  addToken(token: string, persist = false, ident: string = ''): string | void {
    // console.log('addToken()', token, persist, ident);
    // Check token has store information
    try {
      const jsonObj: any = this.decodeToken(token) || {};
      const authJson = this.toUserInfo(jsonObj) || {};
      if (!authJson || !authJson.store) {
        return;
      }
    } catch (e) {
      // console.log('Unable to parse token', token);
      // console.log(e);
      return;
    }

    // Get recent ident lists
    const identLists = this.getIdentLists();

    if (!ident) {
      // Find TokenSpace
      let identTries = 0;
      ident = this.makeAuthIdent();

      while (
        ident !== null && // something is wrong
        (identLists[0].indexOf(ident) > -1 || identLists[1].indexOf(ident) > -1) && // Exists as ident already
        identTries < 100 // too many retries
      ) {
        ident = this.makeAuthIdent();
        identTries++;
      }
      // No Ident
      if (ident === null || identTries === 100) {
        return;
      }

      // Add ident to store list
      if (persist) {
        identLists[0].push(ident);
        setString(this.authCollectionPersistId, JSON.stringify(identLists[0]));
        // console.log('Update Persist Store', JSON.stringify(identLists[0]));
      } else {
        identLists[1].push(ident);
        setString(this.authCollectionId, JSON.stringify(identLists[1]));
        // console.log('Update Session Store', JSON.stringify(identLists[0]));
      }
    }

    // Update Token Key
    setString(this.makeIdentKey(ident, persist), token);

    // Reset auth collections
    return ident;
  }

  // Remove single token
  removeToken(ident) {
    // console.log('removeToken', ident);
    // Check if activated Token
    if (this.authActiveIdent$.value === ident) {
      // console.log('Is Actived Token');
      this.removeActiveIdent();
    }

    const identLists = this.getIdentLists();

    // Filter new ident lists without ident being removed
    const newPersist = identLists[0].filter((a: any) => a !== ident);
    const newSession = identLists[1].filter((a: any) => a !== ident);

    // remove ident from both persist and session stores
    remove(this.makeIdentKey(ident, false));
    remove(this.makeIdentKey(ident, true));

    // set new ident lists in store
    setString(this.authCollectionPersistId, JSON.stringify(newPersist));
    setString(this.authCollectionId, JSON.stringify(newSession));
  }







  // Gets token from store
  resetActiveIdent() {
    // console.log('resetActiveToken()');
    // Get previous auth token id
    const activeToken = getString(this.authTokenId) || '';
    if (!activeToken) {
      return;
    }
    const activeJson = this.toUserInfo(this.decodeToken(activeToken) || '{}');
    if (activeJson && activeJson.ident) {
      this.setActiveIdent(activeJson.ident);
    }
  }

  setActiveIdent(ident: string) {
    // console.log('setActiveIdent()', ident);
    setString(this.authTokenId, this.getTokenByIdent(ident));
    this.authActiveIdent$.next(ident);

    const activeIdent = this.authActive$.value || {};
    // this.configService.apiServer = 'http://192.168.126.51:3020';
    // console.log('ActiveIdent', activeIdent);

    const store = activeIdent.store || '';
    if (!store) {
      this.configService.apiServer = '';
    } else {
      this.configService.apiServer = `https://${encodeURIComponent((activeIdent.store || '').trim())}.vendorportal.org`;
    }
  }
  removeActiveIdent() {
    // console.log('removeActiveIdent()');
    remove(this.authTokenId);
    this.configService.apiServer = '';
    this.authActiveIdent$.next('');
  }

  // Token Utils
  decodeToken(token: string): string {
    const baseString = token.substring(0, token.indexOf('.')) || '';
    const decodedToken = atob(baseString);

    return decodedToken;
  }

  useCookieToken() { }

  removeCookieToken() { }

  // Cookie Tokens
  isCookieToken(aid: string): boolean {
    return false;
  }
}
