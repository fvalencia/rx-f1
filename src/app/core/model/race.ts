import { QualifyingResult } from './qualifying';
import { Result } from './result';

export interface Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  circuitName: string;
  date: Date;
  time: string;
  picture: string;
  winner: string;
  qualifyingResults: QualifyingResult[];
  results: Result[];
}
