import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CarpetasService } from '../../services/carpetas.service'
import { ArchivosService } from '../../services/archivos.service'
import { ReporteService } from '../../services/reporte.service'
import { Router } from '@angular/router'
import { IngresarService } from '../../services/ingresar.service'
import { ActivatedRoute } from '@angular/router'
import * as Materialize from 'angular2-materialize'

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})
export class ArchivosComponent implements OnInit {

  pkProyecto: String
  archivos: any[]
  carpetas: any[]
  upload_files: any[] = []
  carpeta_lista: any[] = []
  carpeta_actual: any = { nombre_carpeta: "", ruta_padre: "" }
  archivos_eliminar: any[] = []
  archivos_mover: any[] = []
  archivo_repetido: any
  flag: boolean = true
  p: any


  constructor(private Archivos_Service: ArchivosService,
    private reporteService: ReporteService,
    private Carpetas_Service: CarpetasService,
    private ingresarService: IngresarService,
    private router: Router,
    private route: ActivatedRoute, ) { }


  ngOnInit() {
    $('.modal').modal();

    $('#archivo_repetido').modal({
      dismissible: false
    })

    $('.tabs').tabs();
    $('.dropdown-button').dropdown();
    (localStorage.getItem("carpeta_actual")) ? this.call_from_gerente_bridge() : this.call_from_proyectos()
  }

  padre_id(ruta) {
    var id = ""
    for (var i = ruta.length - 1; i > -1; i--) {
      if (ruta.charAt(i) == "\\") break
      else id += ruta.charAt(i)
    }

    return id.split("").reverse().join("")
  }


  set_flag(val) {
    this.flag = val
  }

  select_all() {
    $('.chk').prop('checked', true);
  }

  call_from_gerente_bridge() {
    let carpeta_actual = JSON.parse(localStorage.getItem("carpeta_actual"))

    this.carpeta_actual.nombre_carpeta = carpeta_actual.nombre_carpeta
    this.carpeta_actual.ruta_padre = carpeta_actual.ruta
    this.Carpetas(this.carpeta_actual.ruta_padre)
    this.Archivos(this.carpeta_actual.ruta_padre)

    this.carpeta_lista.push({
      nombre_carpeta: this.carpeta_actual.nombre_carpeta,
      ruta_padre: this.carpeta_actual.ruta_padre
    })
    
    console.log("Carpeta Actual: ", this.carpeta_actual)
    console.log("Lista Carpetas: ", this.carpeta_lista)
  }

  get_name(carpeta){
    var extension = ""
    for (var i = carpeta.ruta.length - 1; i > -1; i--) {
      if (carpeta.ruta.charAt(i) != '.') extension += carpeta.ruta.charAt(i)
      else break
    }
    carpeta["nombre_carpeta"] = this.invertir(extension)
  }

  call_from_proyectos() {
    this.Carpetas_Service.Obtener_Carpeta_Publica({ ruta: localStorage.getItem("ruta_proyecto") }).subscribe(carpeta => {
      this.carpeta_actual.nombre_carpeta = carpeta[0].nombre_carpeta
      this.carpeta_actual.ruta_padre = carpeta[0].ruta_padre
      this.Carpetas(this.carpeta_actual.ruta_padre + "\\" + this.carpeta_actual.nombre_carpeta)
      //!!!!!!!!!!!!!!!!!!!!!!!
      // this.Archivos(this.carpeta_actual.ruta_padre, this.carpeta_actual.nombre_carpeta)
    })
  }

  modal1() {
    $('#modal1').modal({
      ready: function () {
        $('ul.tabs').tabs();
      }
    })
    $('#modal1').modal('open');
  }

  Confirmar_eliminar_Carpeta(carpeta) {
    console.log(carpeta)
    this.Carpetas_Service.Eliminar_Carpeta({ruta: carpeta.ruta, real_path: this.points_to_slash(carpeta.ruta)}).subscribe(res => {
      if (res.success) {
        var pos = this.FindObject(carpeta.nombre_carpeta)
        this.carpetas.splice(pos,1)
      }
      else
        Materialize.toast('ERROR, primero debe borrar el contenido de esta carpeta', 5000, 'red rounded')
    })
  }

  Confirmar_Desenlazar() {
    $('#opciones').modal('close');
    this.archivos_eliminar = []
    let checkboxes = $('.chk:checkbox:checked')

    for (let i = 0; i < checkboxes.length; i++) {
      this.archivos_eliminar.push({
        ruta_padre: this.carpeta_actual.ruta_padre,
        real_path: this.points_to_slash(this.carpeta_actual.ruta_padre),
        nombre_carpeta: this.carpeta_actual.nombre_carpeta,
        nombre_archivo: checkboxes[i].attributes[4].nodeValue,
        nombre_proyecto: localStorage.getItem("nombre_proyecto")
      })
    }
    console.log(this.archivos_eliminar);
    (checkboxes.length == 1)
      ? $('#mensaje_eliminar').text("¿Realmente deseea desenlazar el archivo?")
      : $('#mensaje_eliminar').text("¿Realmente deseea desenlazar los archivos?");
    $('#desenlazar').modal('open');

  }

  Archivos(ruta_padre) {
    this.Archivos_Service.Obtener_Archivos({ ruta_padre: ruta_padre}).subscribe(archivos => {

      archivos.forEach(archivo => {
        var extension = ""
        for (var i = archivo.nombre_archivo.length - 1; i > -1; i--) {
          if (archivo.nombre_archivo.charAt(i) != '.') extension += archivo.nombre_archivo.charAt(i)
          else break
        }

        archivo["extension"] = this.invertir(extension)
      })
      console.log(archivos)
      this.archivos = archivos
    })
  }

  Carpetas(ruta) {
    this.Carpetas_Service.Obtener_Carpetas({ ruta: ruta }).subscribe(carpetas => {
      console.log(carpetas)
      carpetas.forEach(element => {
        this.get_name(element)
      });
      this.carpetas = carpetas
    })
  }

  Abrir_Carpeta(carpeta) {
    console.log(carpeta)
    this.carpeta_actual.ruta_padre = carpeta.ruta
    this.carpeta_actual.nombre_carpeta = carpeta.nombre_carpeta

    this.carpeta_lista.push({
      nombre_carpeta: this.carpeta_actual.nombre_carpeta,
      ruta_padre: this.carpeta_actual.ruta_padre
    })

    console.log("Carpeta Actual: ", this.carpeta_actual)
    console.log("Lista Carpetas: ", this.carpeta_lista)

    this.Carpetas(carpeta.ruta)
    this.Archivos(carpeta.ruta)
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


  Enlazar_Carpeta() {
    if ($('#nombre_carpeta').val() == "") {
      Materialize.toast('Debe agregar un nombre', 3000, 'red rounded')
    }
    else {
      var path = `${this.carpeta_actual.ruta_padre}.${$('#nombre_carpeta').val()}`
      let carpeta = {
        ruta: path,
        real_path: this.points_to_slash(path)
      }

      console.log(carpeta)
      this.Carpetas_Service.Guardar_Carpeta(carpeta).subscribe(res => {
        console.log(res)
        if (res.success) {
          $('#modal1').modal('close');
          Materialize.toast('Carpeta Agregada', 3000, 'green rounded')
          this.get_name(carpeta)
          this.carpetas.push(carpeta)
          $("#nombre_carpeta").val("")
        }
        else {
          if (res.err.code == "23505") {
            Materialize.toast(`La carpeta \"${$('#nombre_carpeta').val()}\" ya existe`, 3000, 'red rounded')
          }
          else Materialize.toast("error desconocido", 3000, 'red rounded')
        }
      })
    }
  }

  points_to_slash(str){
    var userprofile = "%"
    var i;
    for (i = 0; i < str.length; i++) {
      if(str.charAt(i) == '.') break
      userprofile += str.charAt(i)
    }
    userprofile += "%"
    userprofile = `${userprofile}.${str.substring(i+1, str.lenght)}`
    userprofile = userprofile.split('.').join('\\');
    return userprofile
  }

  Enlazar_Archivos() {
    if (this.upload_files.length != 0) {

      let archivos = this.upload_files.map(file => {
        return {
          realPath: file.path,
          ruta: this.carpeta_actual.ruta_padre,
          nombre_archivo: file.name,
          ruta_padre: this.carpeta_actual.ruta_padre
        };
      })
      const reporte = {
        nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
        accion: 'Agregar',
        modulo: 'Archivos',
        alterado: 'NONE'
      }

      this.set_path(archivos)
      console.log(archivos)

      this.Archivos_Service.Guardar_Archivo(archivos).subscribe(res => {
        var flag = false;
        var aux_arr = []

        for (let i = 0; i < res.arr.length; i++) {
          if (!res.arr[i].success) {
            if (res.arr[i].err.code == "23505") {
              Materialize.toast(`El archivo "${this.upload_files[i].name}" ya existe`, 7000, 'red rounded')
              flag = true;
              aux_arr.push(false)
            }
          }
          else {
            Materialize.toast(`El archivo "${this.upload_files[i].name}" se enlazo al proyecto exitosamente`, 3000, 'green rounded')
            aux_arr.push(true)
            
            this.get_extension(archivos[i])

            this.archivos.push(archivos[i])
            //NOW ADDING TO HISTORY
            reporte.alterado = this.upload_files[i].name;
            this.reporteService.addReport(reporte).subscribe(data => {
              if (!data.success) {
                Materialize.toast('Error al guardar historial', 3000, 'red rounded')
              }
            })
            //END OF history
          }
        }

        this.limpiar_upload_files(aux_arr);

        // this.Archivos(this.carpeta_actual.ruta_padre, this.carpeta_actual.nombre_carpeta);
        (!flag) ? $('#modal1').modal('close') : null;
      })
    }
    else Materialize.toast('Debe elegir al menos un archivo', 3000, 'red rounded')
  }

  set_path(data){
    data.forEach(e => {
      var userprofile = "%"
      var i;
      for (i = 0; i < e.ruta.length; i++) {
        if(e.ruta.charAt(i) == '.') break
        userprofile += e.ruta.charAt(i)
      }
      userprofile += "%"
      userprofile = `${userprofile}.${e.ruta.substring(i+1, e.ruta.lenght)}`
      userprofile = userprofile.split('.').join('\\');
      e.ruta = userprofile
    });
  }

  get_extension(archivo){
    var extension = ""
    for (var i = archivo.nombre_archivo.length - 1; i > -1; i--) {
      if (archivo.nombre_archivo.charAt(i) != '.') extension += archivo.nombre_archivo.charAt(i)
      else break
    }
    archivo["extension"] = this.invertir(extension)
  }

  limpiar_upload_files(arr){
    for(var i = arr.length - 1; i>=0 ;i--){
        if(arr[i]) this.upload_files.splice(i,1);
    }
    var $el = $('#inputfile');
    $el.wrap('<form>').closest('form').get(0).reset();
    $el.unwrap();
  }

  Abrir_Archivo(file) {
    // console.log(e)
    // console.log(this.carpeta_actual.ruta_padre)
    this.Archivos_Service.Abrir_Archivo({ ruta: `${this.points_to_slash(file.ruta_padre)}\\\"${file.nombre_archivo}\"` }).subscribe(res => {
      Materialize.toast('Abriendo archivo', 3000, 'green rounded')
    })
  }

  Desenlazar_Archivo() {  //el archivo a desenlazar
    console.log(this.archivos_eliminar)
    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Desenlazar',
      modulo: 'Archivos',
      alterado: 'NONE'
    }
    this.Archivos_Service.Desenlazar_Archivo(this.archivos_eliminar).subscribe(res => {
      res.arr.forEach(e => {
        if (e.success) {
          Materialize.toast(`El archivo ${e.nombre_archivo} se desenlazo correctamente`, 3000, 'green rounded')
          //NOW ADDING TO HISTORY
          reporte.alterado = e.nombre_archivo;
          this.reporteService.addReport(reporte).subscribe(data => {
            if (!data.success) {
              Materialize.toast('Error al guardar historial', 3000, 'red rounded')
            }
          })
          //END OF history
        }
        else Materialize.toast(`Error, el archivo ${e.nombre_archivo} no se desenlazo`, 5000, 'red rounded')

        //!!!!!!!!!!!!!!!!!!!!!!!
        this.Archivos(this.carpeta_actual.ruta_padre)
      });

    })
  }

  Expresion_Regular(event: any) {
    const pattern = /[a-zA-Z0-9_]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  atras() {
    if (this.carpeta_lista.length != 1) {
      this.carpeta_actual.nombre_carpeta = this.carpeta_lista[this.carpeta_lista.length - 2].nombre_carpeta
      this.carpeta_actual.ruta_padre = this.carpeta_lista[this.carpeta_lista.length - 2].ruta_padre
      this.carpeta_lista.splice(-1, 1)
      console.log("Carpeta Actual: ", this.carpeta_actual)
      console.log("Lista Carpetas: ", this.carpeta_lista)
      this.Carpetas(this.carpeta_actual.ruta_padre)
      this.Archivos(this.carpeta_actual.ruta_padre)
    }
    else {
      (this.ingresarService.isGerente())
        ? this.router.navigate(["/gerente_bridge"], { relativeTo: this.route })
        : this.router.navigate(["/proyecto"], { relativeTo: this.route })
    }
  }

  delete_upload_file(name) {
    for (var i = 0; i < this.upload_files.length; i++) {
      if (this.upload_files[i].name == name) break
    }
    this.upload_files.splice(i, 1);
  }

  onChange(event: any) {
    let files = event.target.files

    if (files.length != 0) {
      Object.keys(files).forEach(key => {
        let file = files[key]
        var extension = ""
        for (var i = file.name.length - 1; i > -1; i--) {
          if (file.name.charAt(i) != '.') extension += file.name.charAt(i)
          else break
        }
        this.upload_files.push({ name: file.name, path: file.path, ext: this.invertir(extension) })
      });
    }

    this.upload_files = this.removeDuplicates(this.upload_files, "path");
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  mostar_editar_nombre_carpeta(num){
    $("#tt" + num).css("display", "none")
    $("#ii" + num).css("display", "block")
    $("#input_carpeta" + num).focus()
  }

  get_path_destination_folder(origin, folder_name){
    for (var i = origin.length; i > -1; i--) {
        if(origin.charAt(i) == '.') break;
    }
    return `${origin.substring(0,i)}.${folder_name}`
  }

  editar_nombre_carpeta(num, folder, page = 1){
    var new_name = $("#input_carpeta" + num).val()

    let origin_slash = this.points_to_slash(folder.ruta)
    let origin_point = folder.ruta
    let destiny_point = this.get_path_destination_folder(folder.ruta, new_name)

    if (folder.nombre_carpeta != new_name) {
      this.Carpetas_Service.Editar_nombre_Carpeta({origin_slash: origin_slash,
                                                   origin_point: origin_point,
                                                   destiny_point: destiny_point,
                                                   new_name: new_name}).subscribe(res => {
        
        if(res.success){
          $("#ii" + num).css("display", "none")
          $("#tt" + num).css("display", "block")
          let actual = num + ((page - 1) * 5) 
          this.carpetas[actual]["nombre_carpeta"] = new_name
          this.carpetas[actual]["ruta"] = destiny_point
        }
        else Materialize.toast(`Error, ya existe una carpeta llamada "${new_name}"`, 3000, 'red rounded')
      })
    }
    else {
      $("#ii" + num).css("display", "none")
      $("#tt" + num).css("display", "block")
    }
  }

  mostar_editar_nombre(num) {
    $("#t" + num).css("display", "none")
    $("#i" + num).css("display", "block")
    $("#input" + num).focus()
  }

  editar_nombre(num, file, page = 1) { 
    var new_name = $("#input" + num).val()
    if (file.nombre_archivo != new_name) {
      this.Archivos_Service.Cambiar_Nombre_Archivo({ruta_padre: file.ruta_padre,
                                                    new_name: new_name,
                                                    nombre_archivo: file.nombre_archivo,
                                                    real_path: this.points_to_slash(file.ruta_padre)}).subscribe(res => {
        
        if(res.success){
          $("#i" + num).css("display", "none")
          $("#t" + num).css("display", "block")
          let actual = num + ((page - 1) * 5) 
          this.archivos[actual]["nombre_archivo"] = new_name
        }
        else Materialize.toast(`Error, ya existe un archivo llamado "${new_name}"`, 3000, 'red rounded')
      })
    }
    else {
      $("#i" + num).css("display", "none")
      $("#t" + num).css("display", "block")
    }
  }

  opciones() {
    let checkboxes = $('.chk:checkbox:checked')
    if (checkboxes.length != 0) {
      $('#opciones').modal('open');
    }
    else Materialize.toast('Debe elejir al menos un archivo para realizar esta acción', 3000, 'red rounded')
  }

  Confirmar_Mover_Archivos() {
    this.Carpetas_Service.Obtener_Arbol({ ruta: localStorage.getItem("ruta_proyecto") }).subscribe(res => {
      console.log(res)
      console.log(localStorage.getItem("ruta_proyecto"))

      $('#mcontent').html("")
      var arr = [];
      res.tree.forEach(node => {
        if(node.padre == res.nombre){
          $('#mcontent').append('<li id="'+ node.nombre_carpeta +'x">'+
                                '<div class="collapsible-header"><i class="material-icons">folder</i>'+
                                node.nombre_carpeta+'</div></li>'
                                );        
        }
        else{
          let li = $(`#${node.padre}x`)
          li.append('<div class="collapsible-body">'+
                    '<ul class="collapsible">'+
                    '<li id="'+ node.nombre_carpeta +'x">'+
                    '<div class="collapsible-header"><i class="material-icons">folder</i>'+
                    node.nombre_carpeta+'</div></li></ul></div>');
        }
        
        arr.push({ ruta: node.ruta, nombre_carpeta: node.nombre_carpeta })
      });

      for (let i = 0; i < arr.length; i++) {
        if (this.carpeta_actual.nombre_carpeta != arr[i].nombre_carpeta) {
          document.getElementById(`${arr[i].nombre_carpeta}x`)
            .addEventListener("click", function (e) {
              e.stopPropagation()
              $('#carpeta_destino').val(arr[i].nombre_carpeta)
              $('#carpeta_oculta').val(arr[i].ruta)
            });
        }
        else {
          // $(`#${arr[i].nombre_carpeta}x`).first().addClass("blue-text")
          let child = $(`#${arr[i].nombre_carpeta}x`).children()[0]
          child.className += " blue-text";
          document.getElementById(`${arr[i].nombre_carpeta}x`)
            .addEventListener("click", function (e) {
              e.stopPropagation()
            });
        }
      }

      $('#carpeta_destino').val("");
      $('.collapsible').collapsible();
      $(".collapsible-header").addClass("active");
      $(".collapsible-body").css("display", "block");
      $(".expand-toggle").toggleClass("expanded");
      $('#opciones').modal('close');
      $('#tree').modal('open');
     
    });

  }

  Mover_Archivos() {
    $('#tree').modal('close');
    this.archivos_mover = []
    let checkboxes = $('.chk:checkbox:checked')

    for (let i = 0; i < checkboxes.length; i++) {
      this.archivos_mover.push({
        ruta_padre: this.carpeta_actual.ruta_padre,
        nombre_archivo: checkboxes[i].attributes[4].nodeValue,
        origen: this.points_to_slash(this.carpeta_actual.ruta_padre)
      })
    }

    
    let destiny = $("#carpeta_oculta").val()
    console.log("***",this.archivos_mover)
    console.log("***", destiny)
    this.Carpetas_Service.Mover_Archivos({ destiny: destiny, destino: this.points_to_slash(destiny), files: this.archivos_mover }).subscribe(res => {
      if (!res.success) {
        this.archivo_repetido = res
        $("#mensaje_archivo_repetido").text(`el destino ya tiene un archivo llamado "${res.nombre_archivo}"`)
        $('#archivo_repetido').modal('open');
      }
      else {
        this.flag = true
        this.Archivos(this.carpeta_actual.ruta_padre)
      }
    })
  }

  rem_omi(opcion) {
    if (opcion == "reemplazar") {
      this.archivos_mover[this.archivo_repetido.pos][opcion] = true
      this.archivos_mover.splice(0, this.archivo_repetido.pos);
    }
    else {
      this.archivos_mover.splice(0, this.archivo_repetido.pos + 1);
    }

    if (this.archivos_mover.length != 0) {
      let destiny = $("#carpeta_oculta").val()

      this.Carpetas_Service.Mover_Archivos({ destiny: destiny, destino: this.points_to_slash(destiny), files: this.archivos_mover }).subscribe(res => {
        if (!res.success) {
          console.log(res)
          this.archivo_repetido = res
          $("#mensaje_archivo_repetido").text(`el destino ya tiene un archivo llamado "${res.nombre_archivo}"`)
        }
        else {
          $('#archivo_repetido').modal('close');
          this.flag = true
          this.Archivos(this.carpeta_actual.ruta_padre)
        }
      })
    }
    else {
      $('#archivo_repetido').modal('close');
      this.flag = true
      this.Archivos(this.carpeta_actual.ruta_padre)
    }

  }

  FindObject(nombre_carpeta) {
    for (var i = 0; i < this.carpetas.length; i++) {
      if (this.carpetas[i]['nombre_carpeta'] == nombre_carpeta) {
        return i;
      }
    }
  }
}
