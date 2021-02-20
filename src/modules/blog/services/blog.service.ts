import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '@modules/app-config/index';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CreatePostPayload, ResultsPost, UpdatePostPayload } from '@typings/blog';
import { UUID } from '@typings/index';

@Injectable()
export class BlogService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private router: Router
  ) { }

  getPosts(): Observable<ResultsPost[]> {
    return this.http.get<ResultsPost[]>(this.configService.config.apiPath + '/blog').pipe(
      map(posts => (posts as ResultsPost[]))
    );
  }

  getPost(postSlug: string): Observable<ResultsPost | null> {
    const params = new HttpParams().set('findBy', 'slug');
    return this.http.get<ResultsPost>(
      this.configService.config.apiPath + '/blog/' + encodeURIComponent(postSlug),
      { params }
    ).pipe(map(post => post as ResultsPost));
  }

  createPost(payload: CreatePostPayload): Observable<ResultsPost | Error> {
    return this.http.post<ResultsPost>(this.configService.config.apiPath + + '/blog', payload).pipe(
      tap(response => this.router.navigate(['/' + encodeURIComponent(response.slug)])),
      map(post => post as ResultsPost)
    );
  }

  updatePost(post: ResultsPost, payload: UpdatePostPayload): Observable<undefined | Error> {
    return this.http.put<any>(
      this.configService.config.apiPath + '/blog/' + encodeURIComponent(post.id),
      payload
    ).pipe(
      tap(() => this.router.navigate(['/blog/' + encodeURIComponent(post.slug)]))
    );
  }

  deletePost(id: UUID): Observable<undefined | Error> {
    return this.http.delete<undefined>(
      this.configService.config.apiPath + '/blog/' + encodeURIComponent(id)
    ).pipe(
      tap(() => this.router.navigate([`/`]))
    );
  }
}
