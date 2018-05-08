import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import * as global from './globals';

@Injectable()
export class PlanillaService {
  planilla: any

  constructor(private http: Http) { }

  /////////////////////////////////////////////PLANILLA/////////////////////////////////////////////
  GuardarPlanilla(planilla) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/saveworker', planilla, { headers: headers }).map(res => res.json())
  }

  getAll(proyecto) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/workers', proyecto, { headers: headers }).map(res => res.json())
  }
  ///////////////////////////////////////////////////////////////////////////////////
  getById(planilla) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/getworker', planilla, { headers: headers }).map(res => res.json())
  }

  EditarPlanilla(planilla) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(global.ROUTE + '/api/workers', planilla, { headers: headers }).map(res => res.json())
  }
  ///////////////////////////////////////////////////////////////////////////////////
  EliminarPlanilla(planilla){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/deleteworkers', planilla, { headers: headers }).map(res => res.json())
  }

  BuscarPlanilla(FilPar){//Filtro y parametro
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/searchworkers', FilPar, { headers: headers }).map(res => res.json())
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////
}
