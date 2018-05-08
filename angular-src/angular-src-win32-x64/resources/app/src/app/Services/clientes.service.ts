import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import * as global from './globals';

@Injectable()
export class ClientesService {
  cliente: any

  constructor(private http: Http) { }

  /////////////////////////////////////////////CLIENTES/////////////////////////////////////////////
  GuardarCliente(cliente) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/customers', cliente, { headers: headers }).map(res => res.json())
  }

  getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(global.ROUTE + '/api/customers', { headers: headers }).map(res => res.json())
  }

  Detalles(cliente){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/getdetailcustomer', cliente, { headers: headers }).map(res => res.json())
  }
  ///////////////////////////////////////////////////////////////////////////////////
  getById(cliente) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/getcustomer', cliente, { headers: headers }).map(res => res.json())
  }

  EditarCliente(cliente) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(global.ROUTE + '/api/customers', cliente, { headers: headers }).map(res => res.json())
  }
  ///////////////////////////////////////////////////////////////////////////////////
  EliminarCliente(cliente){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/deletecustomers', cliente, { headers: headers }).map(res => res.json())
  }

  BuscarCliente(FilPar){//Filtro y parametro
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/searchcustomers', FilPar, { headers: headers }).map(res => res.json())
  }

  getCNA() {//obtener clientes solo con Cedula, Nombre y apellidos (CNA)
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(global.ROUTE + '/api/customerscna', { headers: headers }).map(res => res.json())
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////

}
