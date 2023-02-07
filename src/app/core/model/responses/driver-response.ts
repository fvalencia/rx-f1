import { Driver } from "../driver";

export interface DriversResponse {
  MRData: {
    limit: string;
    offset: string;
    total: string;
    DriverTable: {
      Drivers: Driver[];
    };
  };
}
