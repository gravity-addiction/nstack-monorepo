export interface ResultsRecordGroup {
  zone: string;
  state: string;
  category?: string;
  record?: string;
  performance?: string;
}

export interface ResultsRecordGroupClassed {
  record: string;
  records: Array<ResultsRecordGroup>;
}

export interface ResultsRecordGrouped {
  subclass?: string;
  records: Array<ResultsRecordGroupClassed>;
}

export interface ResultsRecordUSPA {
  id: number;
  zone: string;
  state: string;
  subclass?: string;
  category?: string;
  record?: string;
  performance?: string;
  recordno?: string;
  uspaclass?: string;
  uspadate?: string;
  location?: string;
  holders?: string;
  judges?: string;
  notes?: string;
  status?: string;
}

// Record Params
export interface RecordParams {
  id: string;
}
// Record Query
export interface RecordQuery {
  id: string;
}

/////////////////////////
// RECORDS BY STATE

// Records By State, Results
export interface ResultsRecordsByState {
  abbr: string;
  state: string;
  records: Array<ResultsRecordUSPA>;
}

// Records By State Params
export interface RecordsByStateParams {
  abbr: string;
}

// Records By State Query
// export interface RecordsByStateQuery {
// }

// Records By State Error Codes
export type RecordsByStateErrorCodes = 'RECORDS_NOT_FOUND' | 'ERROR_FINDING_RECORDS';

/////////////////////////
// RECORDS BY PERSON

// Records By Person, Results
export interface ResultsRecordsByPerson {
  id: string;
  records: Array<ResultsRecordUSPA>;
}

// Records By Person Params
export interface RecordsByPersonParams {
  id: string;
}


export interface RecordsUSPASubclass {
  uspaSubclass: string;
  abbr: string;
}

