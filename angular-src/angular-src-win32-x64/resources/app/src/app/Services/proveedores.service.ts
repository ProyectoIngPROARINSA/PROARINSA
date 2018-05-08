import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import * as global from './globals';

@Injectable()
export class ProveedoresService {
  proveedor: any

  constructor(private http: Http) { }

  /////////////////////////////////////////////PROVEEDORES/////////////////////////////////////////////
  GuardarProveedor(proveedor) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/providers', proveedor, { headers: headers }).map(res => res.json())
  }

  getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(global.ROUTE + '/api/providers', { headers: headers }).map(res => res.json())
  }
  ///////////////////////////////////////////////////////////////////////////////////
  getById(proveedor) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/getprovider', proveedor, { headers: headers }).map(res => res.json())
  }

  EditarProveedor(proveedor) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(global.ROUTE + '/api/providers', proveedor, { headers: headers }).map(res => res.json())
  }
  ///////////////////////////////////////////////////////////////////////////////////
  EliminarProveedor(proveedor){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/deleteproviders', proveedor, { headers: headers }).map(res => res.json())
  }

  BuscarProveedor(FilPar){//Filtro y parametro
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/searchproviders', FilPar, { headers: headers }).map(res => res.json())
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////
}
