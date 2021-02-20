// import { BehaviorSubject } from 'rxjs';

export interface IFolder {
  id: string;
  title: string;
  Server?: string;
  bucket?: string;
  key?: string;
  expanded?: boolean;
  subs?: any; // BehaviorSubject<Array<IFolder>>;
  cmd?: any;
  cloudfront?: boolean;
  anonymous?: boolean;
  params?: any;
  style?: any;
}

