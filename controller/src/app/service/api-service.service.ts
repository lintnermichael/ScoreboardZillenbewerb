import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Einer } from '../models/einer.model';
import { Zweier } from '../models/zweier.model';
import { Config } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private http = inject(HttpClient);
  private url = 'http://192.168.0.14:5000/';

  getAllEiner() {
    return this.http
      .get<Einer[]>(this.url + 'einer');
  }

  addEiner(einer: Einer) {
    return this.http
      .post<Einer>(this.url + 'einer', einer)
  }

  updateEiner(einer: Einer) {
    return this.http
      .put<Einer>(this.url + 'einer/' + einer._id, {name: einer.name, zeit: einer.zeit, fehlerpunkte: einer.fehlerpunkte, feuerwehr: einer.feuerwehr, disqualiviziert: einer.disqualiviziert, startnummer: einer.startnummer});
  }

  getAllZweier(){
    return this.http
      .get<Zweier[]>(this.url + 'zweier');
  }

   addZweier(zweier: Zweier) {
    return this.http
      .post<Einer>(this.url + 'zweier', zweier)
  }

  updateZweier(zweier: Zweier) {
    return this.http
      .put<Zweier>(this.url + 'zweier/' + zweier._id, {name1: zweier.name1, name2: zweier.name2,zeit: zweier.zeit, fehlerpunkte: zweier.fehlerpunkte, feuerwehr: zweier.feuerwehr});
  }

  getConfig() {
    return this.http
      .get<Config>(this.url + 'config');
  }

  updateConfig(config: Config) {
    return this.http
      .put<Config>(this.url + 'config/' + config._id, {home_ff: config.home_ff});
  }

  getPdf() {
    return this.http
      .get(this.url + 'download-pdf', { responseType: 'blob' });
  }
}
