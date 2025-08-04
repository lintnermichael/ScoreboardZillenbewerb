import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataRefresherService {
  einerRefresh$ = new Subject<void>();
  zweierRefresh$ = new Subject<void>();

  triggerRefreshEiner() {
    this.einerRefresh$.next();
  }

  triggerRefreshZweier() {
    this.zweierRefresh$.next();
  }
}
