export interface DriversStandingResponse {
  MRData: {
    StandingsTable: {
      StandingsLists: {
        DriverStandings: {
          position: string;
          positionText: string;
          points: string;
          wins: string;
          Driver: {
            givenName: string;
            familyName: string;
          };
          Constructors: {
            name: string;
          }[];
        }[];
      }[];
    };
  };
}
