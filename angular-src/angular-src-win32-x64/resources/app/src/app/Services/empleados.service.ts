import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import * as global from './globals';

@Injectable()
export class EmpleadosService {
  empleado: any
  
    constructor(private http: Http) { }
  
    /////////////////////////////////////////////EMPLEADOS/////////////////////////////////////////////
    GuardarEmpleado(empleado) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.post(global.ROUTE + '/api/saveemployee', empleado, { headers: headers }).map(res => res.json())
    }
  
    getAll() {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.get(global.ROUTE + '/api/getemployees', { headers: headers }).map(res => res.json())
    }

    getCNA() {//obtener Empleados solo con Cedula, Nombre y apellidos (CNA)
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.get(global.ROUTE + '/api/employeescna', { headers: headers }).map(res => res.json())
    }

    ///////////////////////////////////////////////////////////////////////////////////
    getById(empleado) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.post(global.ROUTE + '/api/getemployee', empleado, { headers: headers }).map(res => res.json())
    }
  
    EditarEmpleado(empleado) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.put(global.ROUTE + '/api/editemployee', empleado, { headers: headers }).map(res => res.json())
    }
    ///////////////////////////////////////////////////////////////////////////////////
    EliminarEmpleado(empleado){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.post(global.ROUTE + '/api/deleteemployee', empleado, { headers: headers }).map(res => res.json())
    }
  
    BuscarEmpleado(FilPar){//Filtro y parametro
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.post(global.ROUTE + '/api/searchemployee', FilPar, { headers: headers }).map(res => res.json())
    }
  
    ///////////////////////////////////////////////////////////////////////////////////////////////////

}
