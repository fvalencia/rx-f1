interface Driver {
  givenName: string;
  familyName: string;
}

interface Constructor {
  name: string;
}

export interface ExRace {
  season: string;
  round: string;
  url: string;
  raceName: string;
  date: string;
  time: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
  };
  Results: {
    status: string;
    number: string;
    position: string;
    points: string;
    grid: string;
    laps: string;
    Driver: Driver;
    Constructor: Constructor;
    Time: {
      time: string;
    };
  }[];
  QualifyingResults: {
    number: string;
    position: string;
    Q1: string;
    Q2: string;
    Q3: string;
    Driver: Driver;
    Constructor: Constructor;
  }[];
}

export interface RacesResponse {
  MRData: {
    limit: string;
    offset: string;
    total: string;
    RaceTable: {
      Races: ExRace[];
    };
  };
}
