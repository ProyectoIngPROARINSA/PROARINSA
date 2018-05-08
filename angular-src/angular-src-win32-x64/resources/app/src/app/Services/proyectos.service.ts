import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import * as global from './globals';

@Injectable()
export class ProyectosService {
  proyecto: any

  constructor(private http: Http) { }

  /////////////////////////////////////////////PROYECTOS/////////////////////////////////////////////
  GuardarProyecto(proyecto) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/saveproject', proyecto, { headers: headers }).map(res => res.json())
  }

  getAll(cliente) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/getprojects', cliente, { headers: headers }).map(res => res.json())
  }
  ///////////////////////////////////////////////////////////////////////////////////
  getById(proyecto) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/getproject', proyecto, { headers: headers }).map(res => res.json())
  }

  Detalles(id){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/detailproject', id, { headers: headers }).map(res => res.json())
  }

  EditarProyecto(proyecto) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(global.ROUTE + '/api/editproject', proyecto, { headers: headers }).map(res => res.json())
  }
  ///////////////////////////////////////////////////////////////////////////////////
  EliminarProyecto(proyecto){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/deleteproject', proyecto, { headers: headers }).map(res => res.json())
  }

  BuscarProyecto(FilPar){//Filtro y parametro
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/searchproject', FilPar, { headers: headers }).map(res => res.json())
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////

}
