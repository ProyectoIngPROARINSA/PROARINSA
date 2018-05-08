import { Component, OnInit } from '@angular/core';
import { CarpetasService } from '../../services/carpetas.service'
import { DataService } from '../../services/data.service'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-gerente-bridge',
  templateUrl: './gerente-bridge.component.html',
  styleUrls: ['./gerente-bridge.component.css']
})
export class GerenteBridgeComponent implements OnInit {

  carpetas: any[]

  constructor(private Carpetas_Service: CarpetasService,
              private router: Router,
              private route: ActivatedRoute,
              private data: DataService) { }

  ngOnInit() {
    // this.data.current_ruta_proyecto.subscribe(ruta_proyecto =>{
    //   this.Carpetas(ruta_proyecto);
    // })
    this.Carpetas(localStorage.getItem("ruta_proyecto"));
  }

  Carpetas(ruta) {
    this.Carpetas_Service.Obtener_Carpetas({ ruta: ruta }).subscribe(carpetas => {
      carpetas.forEach(element => {
        this.get_name(element)
      });
      console.log(carpetas)
      this.carpetas = carpetas
    })
  }

  get_name(carpeta){
    var extension = ""
    for (var i = carpeta.ruta.length - 1; i > -1; i--) {
      if (carpeta.ruta.charAt(i) != '.') extension += carpeta.ruta.charAt(i)
      else break
    }
    carpeta["nombre_carpeta"] = this.invertir(extension)
  }

  invertir(cadena) {
    var x = cadena.length;
    var cadenaInvertida = "";

    while (x >= 0) {
      cadenaInvertida += cadena.charAt(x);
      x--;
    }
    return cadenaInvertida;
  }

  Abrir_Carpeta(carpeta) {
    console.log(carpeta)
    localStorage.setItem("carpeta_actual",JSON.stringify(carpeta))
    this.router.navigate(["/archivos"], { relativeTo: this.route })
  }

  atras(){
    this.router.navigate(["/proyecto"], { relativeTo: this.route })
  }

}
