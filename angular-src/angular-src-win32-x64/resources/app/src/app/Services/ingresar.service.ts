import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import * as global from './globals';

import * as CryptoJS from 'crypto-js';

@Injectable()
export class IngresarService {
  empleado: any
  secretKey = 'notToday'
  


  constructor(private http: Http) { }

  logear(empleado) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(global.ROUTE + '/api/empleados', empleado, { headers: headers }).map(res => res.json())
  }

  getAllEmployers() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(global.ROUTE + '/api/getemployees', { headers: headers }).map(res => res.json())
  }

  store(value) {
    console.log(value)
    return CryptoJS.AES.encrypt(value, this.secretKey)
  }

  loggedIn() {
    return (localStorage.getItem('dni') && localStorage.getItem('privilegio')) ? true : false
  }

  updateName() {
    if (localStorage.getItem('dni')) {
      return localStorage.getItem('nombre');
    } else {
      return '';
    }
  }

  get(key) {
    var encryptedData = window.localStorage.getItem(key)
    if (encryptedData) {
      var bytes = CryptoJS.AES.decrypt(encryptedData.toString(), this.secretKey)
      var plaintext = bytes.toString(CryptoJS.enc.Utf8)
      return plaintext
    }
    return null;
  }

  isGerente() {
    var isGer = this.get('privilegio')
    if (isGer == 'true')
      return true
    return false
  }

}