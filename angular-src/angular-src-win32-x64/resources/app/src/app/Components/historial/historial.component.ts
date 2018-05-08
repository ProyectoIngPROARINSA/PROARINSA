import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../services/proyectos.service'
import { ArchivosService } from '../../services/archivos.service'
import { ReporteService } from '../../services/reporte.service'
import * as Materialize from 'angular2-materialize'
import { ROUTER_INITIALIZER } from '@angular/router';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  files: any[]
  file: String
  pkproyecto: String
  archivo_aux: any = { ruta_padre: "", nombre_carpeta: "", nombre_archivo: "" }
  files_arr: any[] = []
  duplicate_file: any
  elejir: boolean
  ruta_actual: String
  term: any
  p: any


  constructor(private Archivos_Service: ArchivosService, private reporteService: ReporteService) { }

  ngOnInit() {
    $('.modal').modal(); 
    $('#remplazar_omitir').modal({
      dismissible: false
    })
    this.getAll();
  }

  Obtener_nombre_proyecto(ruta) {
    var cont = 0
    var nombre_proyecto = ""
    for (var i = 0; i < ruta.length; i++) {
      if (cont == 5) {
        if (ruta.charAt(i) == "\\") break;
        nombre_proyecto += ruta.charAt(i)
      }
      else if (ruta.charAt(i) == "\\") cont++
    }
    return nombre_proyecto
  }

  getAll() {
    this.Archivos_Service.Papelera().subscribe(files => {
      // files.forEach(file => {
      //   file["nombre_proyecto"] = this.Obtener_nombre_proyecto(file.ruta_padre)
      // });
      console.log(files)
      this.files = files;
    });
  }

  Modal_Recuperar(archivo) {
    this.archivo_aux.ruta_padre = archivo.ruta_padre
    this.archivo_aux.nombre_carpeta = archivo.nombre_carpeta
    this.archivo_aux.nombre_archivo = archivo.nombre_archivo
    $('#recuperar').modal('open');
  }

  Modal_Eliminar(archivo) {
    this.archivo_aux.ruta_padre = archivo.ruta_padre
    this.archivo_aux.nombre_carpeta = archivo.nombre_carpeta
    this.archivo_aux.nombre_archivo = archivo.nombre_archivo
    $('#eliminar').modal('open');
  }

  FindObject(id) {
    for (var i = 0; i < this.files.length; i++) {
      if (this.files[i]['id'] == id) {
        return this.files[i];
      }
    }
  }

  Recuperar_Archivos() {
    $('#opciones').modal('close');
    this.files_arr = []
    let checkboxes = $('.chk:checkbox:checked')
    let id = checkboxes[0].attributes[4].nodeValue
    for (let i = 0; i < checkboxes.length; i++) {
      let id = checkboxes[i].attributes[4].nodeValue
      this.files_arr.push(this.FindObject(id))
    }

    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Recuperar',
      modulo: 'Papelera',
      alterado: 'NONE'
    }

    this.Archivos_Service.Recuperar_Archivo(this.files_arr).subscribe(res => {
      console.log(res)
      if (!res.success) {
        this.duplicate_file = res
        $('#mensaje_remplazar_omitir').text(`El destino ya posee un archivo llamado \"${res.file.nombre_archivo}\"`);
        $('#remplazar_omitir').modal('open');
      }
      else {
        this.getAll()
        //recuperado
        reporte.alterado = res.name;
        this.reporteService.addReport(reporte).subscribe(data => {
          if (!data.success) {
            Materialize.toast('Error al guardar historial', 3000, 'red rounded')
          }
        })
        //END OF history
      }
    });
  }

  rem_or_omi(opcion) {

    if (opcion == "reemplazar") {
      this.files_arr[this.duplicate_file.pos][opcion] = true
      this.files_arr.splice(0, this.duplicate_file.pos);
    }
    else {
      this.files_arr.splice(0, this.duplicate_file.pos + 1);
    }

    if (this.files_arr.length != 0) {
      this.Archivos_Service.Recuperar_Archivo(this.files_arr).subscribe(res => {
        console.log(res)
        if (!res.success) {
          this.duplicate_file = res
          $('#mensaje_remplazar_omitir').text(`El destino ya posee un archivo llamado \"${res.file.nombre_archivo}\"`);
        }
        else {
          $('#remplazar_omitir').modal('close');
          this.getAll()
        }
      });
    }
    else {
      $('#remplazar_omitir').modal('close');
      this.getAll()
    }
  }

  Confirmar_Eliminar() {
    let checkboxes = $('.chk:checkbox:checked');
    (checkboxes.length == 1)
      ? $('#mensaje_eliminar').text("¿Está seguro que desea eliminar este archivo de forma permanente?")
      : $('#mensaje_eliminar').text(`¿Está seguro que desea eliminar estos ${checkboxes.length} elementos de forma permanente?`);
    $('#opciones').modal('close');
    $('#eliminar').modal('open');
  }

  Eliminar_Archivo() {

    this.files_arr = []
    let checkboxes = $('.chk:checkbox:checked')

    let id = checkboxes[0].attributes[4].nodeValue
    for (let i = 0; i < checkboxes.length; i++) {
      let id = checkboxes[i].attributes[4].nodeValue
      this.files_arr.push(this.FindObject(id))
    }
    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Eliminar',
      modulo: 'Papelera',
      alterado: 'NONE'
    }
    console.log(this.files_arr)

    this.Archivos_Service.Eliminar_Archivo(this.files_arr).subscribe(res => {
      console.log(res)
      $('.chk').prop('checked', false);
      res.arr.forEach(e => {
        if (e.success) {
          Materialize.toast(`El archivo ${e.nombre_archivo} se elimino exitosamente`, 3000, 'green rounded')
          //NOW ADDING TO HISTORY
          reporte.alterado = e.nombre_archivo;
          this.reporteService.addReport(reporte).subscribe(data => {
            if (!data.success) {
              Materialize.toast('Error al guardar historial', 3000, 'red rounded')
            }
          })
          //END OF history
        }
        else
          Materialize.toast(`Error en la base de datos`, 3000, 'red rounded')
      });
      this.getAll()
    });
  }

  Abrir_Archivo(file) {
    let name = this.string_val(file.nombre_archivo, file.id)
    let ruta = `%userprofile%\\Documents\\SistemaPROARINSA\\papelera\\\"${name}\"`
    this.Archivos_Service.Abrir_Archivo({ ruta: ruta }).subscribe(res => {
      Materialize.toast(`Abriendo archivo`, 3000, 'green rounded')
    });
  }


  string_val(name, id) {
    var i;
    for (i = name.length - 1; i > -1; i--) {
      if (name.charAt(i) == '.') break
    }
    var pos = i
    var p1 = name.substring(0, pos);
    var p2 = name.substring(pos, name.length);
    return `${p1}papelera${id}${p2}`
  }

  ver_ruta(ruta){
    this.ruta_actual = this.points_to_slash(ruta)
    $('#modal_ruta').modal('open');
  }

  points_to_slash(str){

    var cont = 0;
    for (var i = 0; i < str.length; i++) {
      if(str.charAt(i) == '.') cont++
      if(cont == 5) break;
    }

    var points = str.substring(i+1, str.lenght)
    points = points.split('.').join('\\');
    return points
  }

  Anyone_checked() {
    return ($('.chk:checkbox:checked').length != 0) ? true : false
  }

  select_all() {
    $('.chk').prop('checked', true);
  }

  deselect_all() {
    $('.chk').prop('checked', false);
  }

  Ir_Opciones() {
    $('#opciones').modal('open');
  }
}
