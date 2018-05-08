import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import * as global from './globals';

@Injectable()
export class ReporteService {
  reporte: any

  constructor(private http: Http) { }

  /////////////////////////////////////////////REPORTES/////////////////////////////////////////////
  getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(global.ROUTE + '/api/getreportes', { headers: headers }).map(res => res.json())
  }

  addReport(reporte) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/savereport', reporte, { headers: headers }).map(res => res.json())
  }

  limpiaReport() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(global.ROUTE + '/api/limpiareport', { headers: headers }).map(res => res.json())
  }
}
