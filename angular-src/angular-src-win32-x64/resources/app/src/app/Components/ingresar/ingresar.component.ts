import { Component, OnInit } from '@angular/core'
import { IngresarService } from '../../services/ingresar.service'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import * as Materialize from 'angular2-materialize'


@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.css']
})
export class IngresarComponent implements OnInit {

  usuario: String
  contrasena: String

  constructor(
    private router: Router,
    private ingresarService: IngresarService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  //Ingreso del usuario
  login() {
    const empleado = {
      user: this.usuario,
      password: this.contrasena
    }
    //si no esta completo el form
    // #######################################################################
    // ################### FALTAN LOS N ESPACIOS EN BLANCO####################
    // #######################################################################
    if (empleado.user == null || empleado.password == null) {
      Materialize.toast('Usuario o contraseña incorrecto, intente de nuevo', 3000, 'red rounded')
      return;
    }

    this.ingresarService.logear(empleado).subscribe(data => {
      if (data.success) {
        console.log(data);
        //logeado correctamente
        localStorage.setItem('dni', data.data.dni)
        localStorage.setItem('nombre', data.data.nombre)
        localStorage.setItem('privilegio', this.ingresarService.store(data.data.isgerente + ''))
        Materialize.toast('Bienvenido', 4000, 'green rounded')
        this.router.navigate(['/cliente'])
        window.location.reload()   //it's bug from angular working on for version 3.0.0
      } else {
        //logeado incorrecto
        Materialize.toast('Usuario o contraseña incorrecto, intente de nuevo', 4000, 'red rounded')
      }
      return;
    });
  }
}
