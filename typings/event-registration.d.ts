export interface ResultsRegistration {
  event: string;
  short_id: string;
  paid: number;
  team_name: string;
  amount: number;
}

export interface Registration {
  event: string;
  short_id: string;
  paid: number;
  team_name: string;
  amount: number;
}

export interface RegistrationSet {
  event: string;
  short_id: string;
  entries: Registration[];
}
