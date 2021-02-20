export interface ResultsPost {
  id: string;
  slug: string;
  backgroundImage: string;
  heading: string;
  subHeading: string;
  meta?: string;
  body: string;
}

/* Create */

export interface CreatePostPayload {
  slug?: string;
  backgroundImage: string;
  heading: string;
  subHeading: string;
  meta?: string;
  body: string;
}

export type CreatePostErrorCodes = 'SLUG_IN_USE' | 'ERROR_CREATING_POST';

/* Read */

export interface ReadPostParams {
  id: string;
}

export interface ReadPostQuery {
  findBy: 'slug';
}

export type ReadPostErrorCodes = 'POST_NOT_FOUND' | 'ERROR_FINDING_POST';

/* Update */

export interface UpdatePostParams {
  id: UUID;
}

export interface UpdatePostPayload {
  backgroundImage?: string;
  heading?: string;
  subHeading?: string;
  meta?: string;
  body?: string;
}

export type UpdatePostErrorCodes = 'POST_NOT_FOUND' | 'ERROR_FINDING_POST' | 'ERROR_UPDATING_POST';

/* Delete */

export interface DeletePostParams {
  id: UUID;
}

export type DeletePostErrorCodes = 'POST_NOT_FOUND' | 'ERROR_FINDING_POST' | 'ERROR_DELETING_POST';

