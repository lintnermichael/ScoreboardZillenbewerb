import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Einer } from '../models/einer.model';
import { Zweier } from '../models/zweier.model';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private http = inject(HttpClient);
  private url = 'http://192.168.0.26:5000/';
  

  getAllEinerHome() {
    return this.http
      .get<Einer[]>(this.url + 'einer/home');
  }

  getAllEinerGuests() {
    return this.http
      .get<Einer[]>(this.url + 'einer/gaeste');
  }

  getAllZweierrHome() {
    return this.http
      .get<Zweier[]>(this.url + 'zweier/home');
  }

  getAllZweierGuests() {
    return this.http
      .get<Zweier[]>(this.url + 'zweier/gaeste');
  }
}
