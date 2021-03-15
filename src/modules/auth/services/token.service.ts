import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/index';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

import { TokenServiceCommon } from './token.service.common';

@Injectable({
  providedIn: 'root',
})
export class TokenService extends TokenServiceCommon {
  constructor(configService: ConfigService, private cookieService: CookieService) {
    super(configService);
    this.cookiesEnabled = !!(this.cookieService.get('cookieSupport')) || false;

    // Get previous auth token id
    const savedToken = this.getString(this.authTokenId) || '';
    const activeJson = this.toUserInfo(this.decodeToken(savedToken) || '{}') || {};
    this.setActiveJson(activeJson);
  }

  getString(str: string) {
    const localToken = localStorage.getItem(str) || '';
    const sessionToken = sessionStorage.getItem(str) || '';
    const cookieToken = this.cookieService.get(str) || '';

    if (this.cookiesEnabled) {
      return cookieToken || localToken || sessionToken || '';
    } else {
      return localToken || sessionToken || '';
    }
  }

  setString(str: string, val: any) {
    if (this.cookiesEnabled && this.persistEnabled) {
      this.cookieService.set(str, val, new Date(new Date().setFullYear(new Date().getFullYear() + 2)), '/');
    } else if (this.persistEnabled) {
      localStorage.setItem(str, val);
    } else {
      sessionStorage.setItem(str, val);
    }
  }

  remove(str: string) {
    try {
      localStorage.removeItem(str);
    } catch (err) {
      // console.log('Error Removing Storage', err);
    }
    try {
      sessionStorage.removeItem(str);
    } catch (err) {
      // console.log('Error Removing Session', err);
    }
    try {
      this.cookieService.delete(str, '/');
    } catch (err) {
      // console.log('Error Removing Cookie', err);
    }
  }

  addAuthHeader(authToken: string, headers: any = {}) {
    // console.log('Add Auth Header');
    const isCookie = this.isCookieToken(authToken);

    // console.log('Header Is Cookie?', isCookie);
    if (!isCookie) {
      headers.Authorization = 'Bearer ' + authToken;
    }

    return headers;
  }



  // Token Utils
  decodeToken(token: string): string {
    const baseString = token.substring(0, token.indexOf('.')) || '';
    const decodedToken = atob(baseString);

    return decodedToken;
  }

  useCookieToken() {
    const cookieToken = this.cookieService.get(this.authTokenId) || '';
    const cookiesEnabled = this.cookieService.get('cookieSupport') || false;
    const activeJson = this.toUserInfo(this.decodeToken(cookieToken) || '{}');
    this.setActiveJson(activeJson);
  }

  removeCookieToken() {
    this.cookieService.delete(this.authTokenId);
  }

  isCookieToken(token: string): boolean {
    if (!token) {
      return false;
    }
    const cookieToken = this.cookieService.get(this.authTokenId) || '';
    const cookiesEnabled = this.cookieService.get('cookieSupport') || false;

    if (cookiesEnabled && cookieToken && cookieToken === token) {
      return true;
    }
    return false;
  }








  ///////////////
  // Token Collections

  // single function to update loginTokens
  public updateAuthCollection(): void {
    // console.log('Upadate Auth Collection');
    this.loginToken$.next(this.getAuthCollection() || []);
  }

  // Fetch from store array lists of auth idents
  // returns [persist[], session[]]
  getIdentLists(): [any[], any[]] {
    const authCollectPersistIdents = this.getString(this.authCollectionPersistId) || '[]';
    const authCollectSessionIdents = this.getString(this.authCollectionId) || '[]';

    let arrPersistIdents: any[] = [];
    let arrSessionIdents: any[] = [];

    // Parse collection list
    try {
      arrPersistIdents = JSON.parse(authCollectPersistIdents) || [];

    } catch(e) { }
    try {
      arrSessionIdents = JSON.parse(authCollectSessionIdents) || [];
    } catch(e) { }

    return [arrPersistIdents, arrSessionIdents];
  }

  // Authentication Collections
  getAuthCollection(): any[] {
    const identLists = this.getIdentLists();
    const arrAuthIdents: any[] = [...identLists[0], ...identLists[1]];

    // Update login Tokens
    const aLen = arrAuthIdents.length;
    const loginTokens = this.loginToken$.value || [];

    for (let a = 0; a < aLen; a++) {
      const authIdent = arrAuthIdents[a];
      const isPersistToken = (identLists[0].findIndex((p: any) => p.ident === authIdent) > -1);

      // Find Existing Ident in loginToken list
      const lInd = loginTokens.findIndex((lToken: any) => lToken.ident === authIdent);
      // Leave it alone
      if (lInd > -1) {
        arrAuthIdents[a] = loginTokens[lInd];
        arrAuthIdents[a].persist = isPersistToken;
        continue;
      }


      // Parse to userJson with Garbage collection along the way
      if (!authIdent) {
        this.removeToken(authIdent); arrAuthIdents[a] = null;
        continue;
      }
      const token = this.getTokenByIdent(authIdent);
      if (!token) {
        this.removeToken(authIdent); arrAuthIdents[a] = null;
        continue;
      }
      const jsonString = this.decodeToken(token);
      if (!jsonString) {
        this.removeToken(authIdent); arrAuthIdents[a] = null;
        continue;
      }
      const userJson = this.toUserInfo(jsonString);

      // New Entry
      arrAuthIdents[a] = Object.assign({}, { ident: authIdent, expired: this.isExpired(userJson), persist: isPersistToken }, userJson);
    }

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
    this.remove((persist ? this.authCollectionPersistId : this.authCollectionId));
  }

  addToken(token: string, persist = false, ident: string = ''): string | void {
    // console.log('addToken()', token, persist, ident);
    // Check token has store information
    try {
      const jsonObj: any = this.decodeToken(token) || {};
      const authJson = this.toUserInfo(jsonObj) || {};
      if (!authJson || !authJson.jti) {
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
        // console.log('Failed Ident Generation');
        return;
      }

      // Add ident to store list
      if (persist) {
        identLists[0].push(ident);
        this.setString(this.authCollectionPersistId, JSON.stringify(identLists[0]));
        // console.log('Update Persist Store', JSON.stringify(identLists[0]));
      } else {
        identLists[1].push(ident);
        this.setString(this.authCollectionId, JSON.stringify(identLists[1]));
        // console.log('Update Session Store', JSON.stringify(identLists[0]));
      }
    }

    // Update Token Key
    this.setString(this.makeIdentKey(ident, persist), token);

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
    this.remove(this.makeIdentKey(ident, false));
    this.remove(this.makeIdentKey(ident, true));

    // set new ident lists in store
    this.setString(this.authCollectionPersistId, JSON.stringify(newPersist));
    this.setString(this.authCollectionId, JSON.stringify(newSession));
  }

  // get raw token from key ident
  getTokenByIdent(ident: string) {
    // console.log('getTokenByIdent()', ident);
    return this.getString(this.makeIdentKey(ident, true)) || this.getString(this.makeIdentKey(ident, false)) || '';
  }

  getActiveToken() {
    // console.log('getActiveToken()');
    return this.getTokenByIdent(this.authActiveIdent$.value) || '';
  }

  // Gets token from store
  resetActiveIdent() {
    console.log('resetActiveToken()');
    // Get previous auth token id
    const savedToken = this.getString(this.authTokenId) || '';
    if (!savedToken) {
      console.log('No Saved Token');
      return;
    }
    const activeJson = this.toUserInfo(this.decodeToken(savedToken) || '{}');
    if (activeJson && activeJson.ident) {
      this.setActiveIdent(activeJson.ident);
    } else if (activeJson && activeJson.jti) {
      this.setActiveJson(activeJson);
    }
  }

  removeActiveIdent() {
    // console.log('removeActiveIdent()');
    this.remove(this.authTokenId);
    this.configService.apiServer = '';
    this.authActiveIdent$.next('');
  }









}
