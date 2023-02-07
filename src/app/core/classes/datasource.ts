import { DataSource } from "@angular/cdk/table";
import { MatPaginator } from "@angular/material/paginator";
import { BehaviorSubject, Observable } from "rxjs";

export abstract class BaseDataSource<T> implements DataSource<T> {
    public dataSubject = new BehaviorSubject<T[]>([]);
    public loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public paginator: MatPaginator;
  
    constructor() {}
  
    connect(): Observable<T[]> {
      return this.dataSubject.asObservable();
    }
  
    disconnect(): void {
      this.dataSubject.complete();
      this.loadingSubject.complete();
    }
}