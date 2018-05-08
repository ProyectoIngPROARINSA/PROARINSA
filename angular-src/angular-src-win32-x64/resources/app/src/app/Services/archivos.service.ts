import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import * as global from './globals';

@Injectable()
export class ArchivosService {

  constructor(private http: Http) { }

  Obtener_Archivos(carpeta){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/searchfiles', carpeta, { headers: headers }).map(res => res.json())
  }

  Abrir_Archivo(path){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/openfile', path, { headers: headers }).map(res => res.json())
  }

  Guardar_Archivo(archivo){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/savefiles', archivo, { headers: headers }).map(res => res.json())
  }

  Desenlazar_Archivo(paths){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/unlink', paths, { headers: headers }).map(res => res.json())
  }

  Papelera(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(global.ROUTE + '/api/getunlinkfiles', { headers: headers }).map(res => res.json())
  }

  Recuperar_Archivo(file){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/recoveryfile', file,{ headers: headers }).map(res => res.json())
  }

  Eliminar_Archivo(file){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/deletefile', file, { headers: headers }).map(res => res.json())
  }

  Verificar_Archivo_Repetidos(files){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/verifyduplicatefiles', files, { headers: headers }).map(res => res.json())
  }

  Cambiar_Nombre_Archivo(file){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/changefilename', file, { headers: headers }).map(res => res.json())
  }

}
