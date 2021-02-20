export interface ResultsProfile {
  id: string;
  slug: string;
  name: string;
  peopleId?: number;
}

export interface ResultsProfileSearch {
  keywords: string;
  results: Array<ResultsProfile>;
}

/* Read */

export interface ReadProfileParams {
  profile: string;
}

export interface ReadProfileQuery {
  findBy: 'slug';
}

export type ReadProfileErrorCodes = 'PROFILE_NOT_FOUND' | 'ERROR_FINDING_PROFILE';

/* Search */

export interface SearchProfileQuery {
  keywords: '';
}
