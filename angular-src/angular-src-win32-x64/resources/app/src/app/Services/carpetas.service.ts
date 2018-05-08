import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import * as global from './globals';


@Injectable()
export class CarpetasService {

  constructor(private http: Http) { }

  Obtener_Carpetas(proyecto) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/getfolders', proyecto, { headers: headers }).map(res => res.json())
  }

  Guardar_Carpeta(carpeta){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/savefolder', carpeta, { headers: headers }).map(res => res.json())
  }

  Obtener_Carpeta_Publica(carpeta) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/getpublicfolder', carpeta, { headers: headers }).map(res => res.json())
  }
  
  Eliminar_Carpeta(carpeta){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/deletefolder', carpeta, { headers: headers }).map(res => res.json())
  }

  Obtener_Arbol(carpeta){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/getfoldertree', carpeta, { headers: headers }).map(res => res.json())
  }

  Mover_Archivos(values){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/movefiles', values, { headers: headers }).map(res => res.json())
  }

  Editar_nombre_Carpeta(values){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/editfoldername', values, { headers: headers }).map(res => res.json())
  }

}
