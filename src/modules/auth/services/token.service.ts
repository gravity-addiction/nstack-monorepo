import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/index';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { TokenServiceCommon } from './token.service.common';

@Injectable({
  providedIn: 'root',
})
export class TokenService extends TokenServiceCommon {
  public loginToken$ = new BehaviorSubject<any>([]);

  constructor(configService: ConfigService, private cookieService: CookieService) {
    super(configService);
    this.cookiesEnabled = !!(this.cookieService.get('cookieSupport')) || false;
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

  getActiveToken(): string {
    const localToken = localStorage.getItem(this.authTokenId) || '';
    const sessionToken = sessionStorage.getItem(this.authTokenId) || '';
    const cookieToken = this.cookieService.get(this.authTokenId) || '';

    if (this.cookiesEnabled) {
      return cookieToken || localToken || sessionToken || '';
    } else {
      return localToken || sessionToken || '';
    }
  }

  getTokenByIdent(ident: string) {
    return ''; // getString(this.authCollectionId + '_' + ident) || '';
  }

  addAuthCollection() {
    /*
    const authToken = this.getActiveJson();
    if (!authToken || !authToken.store) { return; }

    // Find TokenSpace
    let identTries = 0;
    let curIdent = this.makeAuthIdent();
    while (curIdent !== null && hasKey(this.authCollectionId + '_' + curIdent) && identTries < 100){
      curIdent = this.makeAuthIdent();
      identTries++;
    }
    // No Ident
    if (identTries === 100) { return; }

    // console.log('User Token', this.authCollectionId + '_' + curIdent);
    setString(this.authCollectionId + '_' + curIdent, this.getActiveToken());

    const authCollect = getString(this.authCollectionId) || '[]';
    let arrAuth: any[] = [];
    try {
      arrAuth = JSON.parse(authCollect);
    } catch(e) { arrAuth = []; }

    this.authCollectionIdent = curIdent;
    arrAuth.push(curIdent);
    setString(this.authCollectionId, JSON.stringify(arrAuth));
    */
  }


  setPersistantToken(token) {
    localStorage.setItem(this.authTokenId, token);
    this.addAuthCollection();
  }

  setSessionToken(token) {
    sessionStorage.setItem(this.authTokenId, token);
  }

  setCookieToken(token) {
    // Hardcoded 2year cookie
    this.cookieService.set(this.authTokenId, token, new Date(new Date().setFullYear(new Date().getFullYear() + 2)), '/');
  }

  setToken(token, rememberme = false) {
    // console.log('Set Token', token);
    this.removeTokens();
    if (rememberme) {
      this.setPersistantToken(token);
    } else {
      this.setSessionToken(token);
    }
  }

  isCookieToken(aid: string): boolean {
    if (!aid) {
      return false;
    }
    const cookieToken = this.cookieService.get(this.authTokenId) || '';
    const cookiesEnabled = this.cookieService.get('cookieSupport') || false;

    if (cookiesEnabled && cookieToken && cookieToken === aid) {
      return true;
    }
    return false;
  }

  removeNonCookieToken() {
    try {
      localStorage.removeItem(this.authTokenId);
    } catch (err) {
      // console.log('Error Removing Storage', err);
    }
    try {
      sessionStorage.removeItem(this.authTokenId);
    } catch (err) {
      // console.log('Error Removing Session', err);
    }
  }
  removeTokens() {
    try {
      this.cookieService.delete(this.authTokenId, '/');
    } catch (err) {
      // console.log('Error Removing Cookie', err);
    }
    this.removeNonCookieToken();
  }


  removePersistentToken(ident) {
    /*
    const authCollect = getString(this.authCollectionId) || '[]';
    let arrAuth: any[] = [];
    try {
      arrAuth = JSON.parse(authCollect);
    } catch(e) { arrAuth = []; }

    arrAuth = arrAuth.filter((authIdent: string) => authIdent !== ident);
    setString(this.authCollectionId, JSON.stringify(arrAuth));
    */
  }


  getActiveJson(): any {
    const token = this.getActiveToken();
    if (!token) {
      return {};
    }
    const jsonString = this.decodeToken(token);
    return this.toUserInfo(jsonString);
  }

  decodeToken(token: string): string {
    const baseString = token.substring(0, token.indexOf('.')) || '';
    const decodedToken = atob(baseString);

    return decodedToken;
  }

  hasActiveToken(): boolean {
    const tokenJson = this.getActiveJson();

    if ((Object.keys(tokenJson) || []).length) {
      return this.notExpired(tokenJson);
    }
    return false;
  }


  // Setting Authentication Tokens
  setActiveIdent(ident) {
  }
  removeActiveIdent() {
  }



  // single function to update loginTokens
  public updateAuthCollection(): void {
    // this.loginToken$.next(this.getAuthCollection() || []);
  }



  ///////////////
  // Token Collections

  // Fetch from store array lists of auth idents
  // returns [persist[], session[]]
  getIdentLists(): [any[], any[]] {
    return [[], []];
    /*
    const authCollectPersistIdents = getString(this.authCollectionPersistId) || '[]';
    const authCollectSessionIdents = getString(this.authCollectionId) || '[]';

    let arrPersistIdents: any[] = [];
    let arrSessionIdents: any[] = [];

    // Parse collection list
    try {
      arrPersistIdents = JSON.parse(authCollectPersistIdents) || []

    } catch(e) { }
    try {
      arrSessionIdents = JSON.parse(authCollectSessionIdents) || []
    } catch(e) { }

    return [arrPersistIdents, arrSessionIdents];
    */
  }

  // Authentication Collections
  getAuthCollection(): any[] {
    return [];
    /*
    const identLists = this.getIdentLists();
    const arrAuthIdents: any[] = [...identLists[0], ...identLists[1]];

    // Update login Tokens
    const aLen = arrAuthIdents.length;
    const loginTokens = this.loginToken$.value || [];

    for (let a = 0; a < aLen; a++) {
      const authIdent = arrAuthIdents[a];
      const isPersistToken = (identLists[0].findIndex((p: any) => p.ident === authIdent) > -1);

      // Find Existing Ident in loginToken list
      const lInd = loginTokens.findIndex((token: any) => token.ident === authIdent);
      // Leave it alone
      if (lInd > -1) {
        arrAuthIdents[a] = loginTokens[lInd];
        arrAuthIdents[a].persist = isPersistToken;
        continue;
      }


      // Parse to userJson with Garbage collection along the way
      if (!authIdent) { this.removeToken(authIdent); arrAuthIdents[a] = null; continue; }
      const token = this.getTokenByIdent(authIdent);
      if (!token) { this.removeToken(authIdent); arrAuthIdents[a] = null; continue; }
      const jsonString = this.decodeToken(token);
      if (!jsonString) { this.removeToken(authIdent); arrAuthIdents[a] = null; continue; }
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
    */
  }

  // removes entire collection of tokens from store
  removeTokenCollection(persist = false) {
    /*
    const identLists = this.getIdentLists();
    const authCollect: any[] = (persist ? identLists[0] : identLists[1]) || [];

    // Remove each known ident from store
    authCollect.forEach((ident: string) => {
      if (!ident || ident === null) { return; }
      this.removeToken(ident);
    })
    // Remove ident collection
    remove((persist ? this.authCollectionPersistId : this.authCollectionId));
    */
  }










  ///////////
  // Single Tokens

  addToken(token: string, persist = false, ident: string = ''): string | void {
    /*
    // Check token has store information
    try {
      const jsonObj: any = this.decodeToken(token) || {};
      const authJson = this.toUserInfo(jsonObj) || {};
      if (!authJson || !authJson.store) { return; }
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
      ){
        ident = this.makeAuthIdent();
        identTries++;
      }
      // No Ident
      if (ident === null || identTries === 100) { return; }

      // Add ident to store list
      if (persist) {
        identLists[0].push(ident);
        setString(this.authCollectionPersistId, JSON.stringify(identLists[0]));
      } else {
        identLists[1].push(ident);
        setString(this.authCollectionId, JSON.stringify(identLists[1]));
      }
    }

    // Update Token Key
    setString(this.makeIdentKey(ident, persist), token);

    // Reset auth collections
    this.updateAuthCollection();
    return ident;
    */
  }

  // Remove single token
  removeToken(ident) {
    /*
    // Check if activated Token
    if (this.authActiveIdent$.value === ident) { this.removeActiveIdent(); }

    const identLists = this.getIdentLists();

    // Filter new ident lists without ident being removed
    const newPersist = identLists[0].filter((a: any) => a.ident !== ident).map((a: any): string => a = a.ident);
    const newSession = identLists[1].filter((a: any) => a.ident !== ident).map((a: any): string => a = a.ident);

    // remove ident from both persist and session stores
    remove(this.makeIdentKey(ident, false));
    remove(this.makeIdentKey(ident, true));

    // set new ident lists in store
    setString(this.authCollectionPersistId, JSON.stringify(newPersist));
    setString(this.authCollectionId, JSON.stringify(newSession));
    */
  }







  ////////////////
  // Active Token
  // Checks validity of active token
  // Gets token from store
  resetActiveIdent() {
    /*
    // Get previous auth token id
    const activeToken = getString(this.authTokenId) || '';
    if (!activeToken) { return; }
    const activeJson = this.toUserInfo(this.decodeToken(activeToken) || '{}');
    if (activeJson && activeJson.ident) {
      this.setActiveIdent(activeJson.ident);
    }
    */
  }

}
