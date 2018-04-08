import { Component, OnInit, ViewChild, ElementRef, Renderer2, Renderer } from '@angular/core';
import { Route } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { ProyectosService } from '../../services/proyectos.service'
import { ClientesService } from '../../services/clientes.service'
import { EmpleadosService } from '../../services/empleados.service'
import { DataService } from '../../services/data.service'
import { Router } from '@angular/router'
import * as Materialize from 'angular2-materialize'

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  // ################################## ATRIBUTOS ##################################
  nombreProyecto: String
  direccion: String
  tipoProyecto: String
  tipoObra: String
  descripcion: String
  estado: String
  banco: String
  switch: Boolean = true
  detalles: any[]
  ax: any[]
  // pkProyecto: String
  // archivos: any[]

  filtro: any
  parametro: String
  RegOrArt: String = ""
  financiamento: String = ""

  @ViewChild('buscador')
  private buscador: ElementRef

  

  @ViewChild('LabelNombreProyecto')
  private LabelNombreProyecto: ElementRef

  @ViewChild('Labeldireccion')
  private Labeldireccion: ElementRef

  @ViewChild('Labeldescripcion')
  private Labeldescripcion: ElementRef

  @ViewChild('Labelbanco')
  private Labelbanco: ElementRef

  @ViewChild('LabelFechaInicio')
  private LabelFechaInicio: ElementRef

  @ViewChild('LabelFechaFinaliza')
  private LabelFechaFinaliza: ElementRef

  @ViewChild('inputnombreProyecto')
  private inputnombreProyecto: ElementRef

  @ViewChild('inputdireccion')
  private inputdireccion: ElementRef

  @ViewChild('inputdescripcion')
  private inputdescripcion: ElementRef

  @ViewChild('inputbanco')
  private inputbanco: ElementRef

  // @ViewChild('abc')
  // private abc: ElementRef

  // ################################## METODOS ##################################

  // --------------------------------- CONSTRUCTOR ---------------------------------
  constructor(private ProyService: ProyectosService,
    private clientesService: ClientesService,
    private empleadosService: EmpleadosService,
    private router: Router,
    private renderer2: Renderer2,
    private renderer: Renderer,
    private route: ActivatedRoute,
    private data: DataService) { }

  ngOnInit() {
    // $('.dropdown-button').dropdown();
    $('.modal').modal();
    $('select').material_select();
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      container: 'body',
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Augosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      closeOnSelect: false // Close upon selecting a date,
    });
    

    this.getAll();
  }

  getAll() {
    this.ProyService.getAll({cedula: localStorage.getItem("id_cliente")}).subscribe(data => {
      console.log(data)
      this.ax = data;
    });
  }

  
  editClick(v: String) {
    alert(v)
  }
  // --------------------------------- LIMPIAR FORMULARIO ---------------------------------
  LimpiarGuardar() {
    $('#FormAgregar').trigger("reset");
  }

  modal1() {
    this.switch = true;
    this.LimpiarGuardar();
    $('#modal1').modal('open');
  }

  // --------------------------------- EDITAR PROYECTO ---------------------------------
  Editar(nom) {
    const proyecto = {
      nombreProyecto: nom
    }
    this.ProyService.getById(proyecto).subscribe(data => {
      this.renderer2.setAttribute(this.LabelNombreProyecto.nativeElement, "class", "active")
      this.nombreProyecto = data.nombreproyecto

      this.renderer2.setAttribute(this.Labeldireccion.nativeElement, "class", "active")
      this.direccion = data.direccion

      this.renderer2.setAttribute(this.Labeldescripcion.nativeElement, "class", "active")
      this.descripcion = data.descripcion

      this.renderer2.setAttribute(this.Labelbanco.nativeElement, "class", "active")
      this.banco = data.banco

      this.tipoProyecto = data.tipoproyecto
      this.tipoObra = data.tipoobra
      this.estado = data.estado


      this.renderer2.setAttribute(this.LabelFechaInicio.nativeElement, "class", "active")
      $('#fechaInicio').val(data.fechainicio)

      this.renderer2.setAttribute(this.LabelFechaFinaliza.nativeElement, "class", "active")
      $('#fechaFinaliza').val(data.fechafinaliza)

      console.log(data)

      this.switch = false
      $('#modal1').modal('open');
    });
  }
  // --------------------------------- ELIMINAR PROYECTO ---------------------------------
  Eliminar(nom) {
    const proyecto = {
      nombreProyecto: nom
    }
    this.ProyService.EliminarProyecto(proyecto).subscribe(data => {
      if (data.success) {
        this.getAll();
        $('#modal2').modal('close');
        Materialize.toast('El proyecto se borró exitosamente', 3000, 'green rounded')
      }
      else {
        alert("algo salio mal")
      }
    });
  }

  // --------------------------------- SUBMIT PROYECTO ---------------------------------
  ProyectoSubmit() {

    if (this.ValidateForm()) {

      const proyecto = {
        nombreProyecto: this.nombreProyecto,
        direccion: this.direccion,
        tipoProyecto: this.tipoProyecto,
        tipoObra: this.tipoObra,
        descripcion: this.descripcion,
        fechaInicio: $('#fechaInicio').val(),
        fechaFinaliza: $('#fechaFinaliza').val(),
        estado: this.estado,
        banco: this.banco,
        cliente: localStorage.getItem("id_cliente")
      }

      if (this.RegOrArt != "" && this.financiamento != "") {
        proyecto.tipoProyecto =
          `${this.tipoProyecto}/${this.RegOrArt}/${this.financiamento}`
      }

      if (this.switch) {//si el switch esta en true guarda
        this.ProyService.GuardarProyecto(proyecto).subscribe(data => {
          if (data.success) {
            console.log(data);
            this.getAll();
            $('#modal1').modal('close');
            Materialize.toast('El proyecto se guardó exitosamente', 3000, 'green rounded')
          }
          else {
            Materialize.toast('Error, nombre repetido', 3000, 'red rounded')
          }
        });
      }
      else {//si el switch esta en false edita
        this.ProyService.EditarProyecto(proyecto).subscribe(data => {
          if (data) {
            this.getAll();
            this.switch = true;
            $('#modal1').modal('close');
            Materialize.toast('El proyecto se guardó exitosamente', 3000, 'green rounded')
          }
          else Materialize.toast('Error en el servidor, ', 3000, 'red rounded')
        });
      }
    }
    else {
      Materialize.toast('Complete los espacios, para continuar', 3000, 'red rounded')
    }

  }

  Only_Numbers(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  ValidateForm() {
    if (this.inputnombreProyecto.nativeElement.value == '')
      return false
    if (this.inputdireccion.nativeElement.value == '')
      return false
    if (this.tipoProyecto == '')
      return false
    if (this.tipoProyecto == 'Subsidios' && (this.RegOrArt == "" || this.financiamento == ""))
      return false
    if (this.tipoObra == '')
      return false
    if (this.inputdescripcion.nativeElement.value == '')
      return false
    if ($('#fechaInicio').val() == '')
      return false
    if ($('#fechaFinaliza').val() == '')
      return false
    if (this.estado == '')
      return false
    if (this.inputbanco.nativeElement.value == '')
      return false


    return true
  }
  

  Ir_Archivos(ruta){
    let gerente = true;
    localStorage.setItem("ruta_proyecto", ruta);
    // this.data.Set_Ruta_Proyecto(ruta);
    (gerente) 
    ? this.router.navigate(["/gerente_bridge"], { relativeTo: this.route })
    : this.router.navigate(["/archivos"], { relativeTo: this.route })
  }

  Ir_Empleados(nombre){
    localStorage.setItem("nombre_proyecto", nombre)
  }

  Detalles(v) {
    console.log(v)
    this.detalles = [v]
    $('#modal4').modal('open')
  }

  TipoFinanciamiento() {
    if (this.tipoProyecto == "Subsidios") $('#modal5').modal('open')
    else {
      this.RegOrArt = ""
      this.financiamento = ""
    }

  }

  IsArticulo59() {
    return (this.RegOrArt == "Articulo 59") ? true : false
  }

  IsRegulares() {
    return (this.RegOrArt == "Regulares") ? true : false
  }

  isInput() {
    return (this.filtro == "nombreProyecto" ||
      this.filtro == "banco") ? true : false
  }

  isTipoObra() {
    return (this.filtro == "tipoObra") ? true : false
  }

  isEstadoProyecto() {
    return (this.filtro == "estado") ? true : false
  }

  isCliente() {
    return (this.filtro == "cliente") ? true : false
  }

  isProfResponsable() {
    return (this.filtro == "profResponsable") ? true : false
  }
  
  atras(){
    this.router.navigate(["/cliente"], { relativeTo: this.route })
  }

}



