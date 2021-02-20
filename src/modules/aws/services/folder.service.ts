import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { IFolder } from '@typings/aws-folders';

@Injectable()
export class FolderService {
  public folderList: BehaviorSubject<Array<IFolder>> = new BehaviorSubject<Array<IFolder>>([]);
  public changeFolder$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public changeFolderObs: Observable<any>;

  public isLoadingFiles = false;
  public isAccessDenied = false;
  public isLoadingError = false;
  public hasNoFiles = false;
  public shownServer = '';
  public shownBucket = '';
  public shownFolder = '';
  public shownLimit = '';

  constructor() {
    this.changeFolderObs = this.changeFolder$.pipe(
      // debounceTime(100),
      distinctUntilChanged(
        (p: any, q: any) => {
          const pS = p.Server || p.server || '';
          const pB = p.Bucket || p.bucket || '';
          const pK = p.Key || p.key || p.folder || '';
          const pL = p.Limit || p.limit || '';
          const qS = q.Server || q.server || '';
          const qB = q.Bucket || q.bucket || '';
          const qK = q.Key || q.key || q.folder || '';
          const qL = q.Limit || q.limit || '';

          return (
            pK === qK &&
            pS === qS &&
            pB === qB &&
            pL === qL
          );
        }),
      map(v => {
        if (!v) {
          return;
        }
        this.updateVariables(v);
        return v;
      })
    );
  }

  updateVariables(v: any) {
    this.isLoadingFiles = true;
    this.isLoadingError = false;
    this.isAccessDenied = false;
    this.hasNoFiles = false;

    this.shownServer = v.Server || v.server || '';
    this.shownBucket = v.Bucket || v.bucket || '';
    this.shownFolder = v.Key || v.key || v.folder || '';
    this.shownLimit = v.Limit || v.limit || '';
  }

  createLocationQuery() {
    const newQuery: any = {};
    if (this.shownServer) {
      newQuery.server = this.shownServer;
    }
    if (this.shownBucket) {
      newQuery.bucket = this.shownBucket;
    }
    if (this.shownFolder) {
      newQuery.folder = this.shownFolder;
    }
    if (this.shownLimit) {
      newQuery.limit = this.shownLimit;
    }
    return Object.keys(newQuery).map(key => key.toLocaleLowerCase() + '=' + encodeURIComponent(newQuery[key])).join('&');

  }

  addFolders(parent: IFolder | null, folders: IFolder | Array<IFolder>, slot: number = 0) {
    if (!Array.isArray(folders)) {
      folders = [folders];
    }
    if (parent === null) {
      // Add to root
      const curFolders = this.folderList.getValue();
      curFolders.splice(slot, 0, ...folders);
      this.folderList.next(curFolders);
    } else {
      // Add to subs
      if (!parent.subs) {
        parent.subs = new BehaviorSubject<Array<IFolder>>([]);
      }
      const curFolders = parent.subs.getValue();
      curFolders.splice(slot, 0, ...folders);
      parent.subs.next(curFolders);
    }
  }

  clearFolders() {
    this.folderList.next([]);
  }

  clearVariables() {
    this.shownServer = '';
    this.shownBucket = '';
    this.shownFolder = '';
    this.shownLimit = '';
  }

  openFolder(event: any, folder: any, params: any) {
    this.changeFolder$.next(folder);
  }

  upFolder(event: any) {
    const backFolder = this.shownFolder.slice(0, this.shownFolder.slice(0, -1).lastIndexOf('/') + 1);
    this.changeFolder$.next({
      server: this.shownServer,
      bucket: this.shownBucket,
      limit: this.shownLimit,
      key: backFolder,
    });
  }

  execFolder(event: any, folder: any) {
    if (folder.cmd) {
      folder.cmd(event, folder, (folder.params || {}));
    }
  }

  getJsonFromUrl(url: string) {
    if (!url) {
      url = location.href;
    }
    const question = url.indexOf('?');
    let hash = url.indexOf('#');
    if (hash === -1 && question === -1) {
      return {};
    }
    if (hash === -1) {
      hash = url.length;
    }
    const query = question === -1 || hash === question + 1 ? url.substring(hash) :
      url.substring(question + 1, hash);
    const result: any = {};
    query.split('&').forEach((part) => {
      if (!part) {
        return;
      }
      part = part.split('+').join(' '); // replace every + with space, regexp-free version
      const eq = part.indexOf('=');
      let key = eq > -1 ? part.substr(0, eq) : part;
      const val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : '';
      const from = key.indexOf('[');
      if (from === -1) {
        result[decodeURIComponent(key)] = val;
      } else {
        const to = key.indexOf(']', from);
        const index = decodeURIComponent(key.substring(from + 1, to));
        key = decodeURIComponent(key.substring(0, from));
        if (!result[key]) {
          result[key] = [];
        }
        if (!index) {
          result[key].push(val);
        } else {
          result[key][index] = val;
        }
      }
    });
    return result;
  }
}
