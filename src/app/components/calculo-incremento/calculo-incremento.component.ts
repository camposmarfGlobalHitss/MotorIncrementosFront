import { Component, OnInit } from '@angular/core';
import { CalculoIncremento } from 'src/app/classes/calculo-incremento';
import { ReglasService } from '../../services/reglas.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Exclusiones } from 'src/app/classes/exclusiones';

@Component({
  selector: 'app-calculo-incremento',
  templateUrl: './calculo-incremento.component.html',
  styleUrls: ['./calculo-incremento.component.css']
})
export class CalculoIncrementoComponent implements OnInit {

  list_cal_inc: CalculoIncremento[] = [];
  pageActual: number = 1;
  parametroUrl: number;
  parametrizacionRelizada: boolean = false;
  data_cargada: boolean = false;
  exclusiones_cargadas: boolean = false;
  idclientefilter: string = '';
  filtroref: string = '';
  idenClientefilter = '';

  title = 'File-Upload-Save';
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  selectedFile = null;
  changeImage = false;
  user_actual: string = '';
  list_exclusiones: Exclusiones[] = [];
  mostrarExclusiones: boolean = false;
  pageActualExc: number = 1;
  cargaMensaje: string;
  constructor(private reglasSrv: ReglasService, 
    private route: Router, 
    private activateRoute: ActivatedRoute) {
    this.activateRoute.params.subscribe(param => {
      this.parametroUrl = +param.parametrizacion;
    });
    console.log(this.parametroUrl);

    if (this.parametroUrl === 1) {
      this.parametrizacionRelizada = true;
      this.cargaMensaje = 'Cargando Datos';
    } else {
      this.parametrizacionRelizada = false;
      this.cargaMensaje = 'Cargando resultado de aplicacion de reglas!!!';
    }
    this.data_cargada = false;
    this.mostrarExclusiones = false;
    this.user_actual = localStorage.getItem('usuario');
    this.mostrarMensajeCargando(this.cargaMensaje);
    this.reglasSrv.traerCuentasPostExtraccion().subscribe(resp => {
      this.list_cal_inc = resp;

      Swal.fire({
        icon: 'success',
        title: 'OK',
        text: 'DATOS CARGADOS CORRECTAMENTE!!',
        allowOutsideClick: false
      });
      this.data_cargada = true;
    }, err => {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Upsss..',
        text: 'Error procesando la solicitud, intente mas tarde',
        allowOutsideClick: false
      });
    });
  }


  ngOnInit(): void {
  }


  mostrarMensajeCargando(mensaje: string) {
    Swal.fire({
      icon: 'info',
      title: 'Por Favor Espere...',
      text: mensaje,
      allowOutsideClick: false
    });
    Swal.showLoading();
  }

  cancelarCalculo() {
    Swal.fire({
      title: 'Realmente desea cancelar el proceso?',
      text: 'si cancela tendra que volver a empezar todo el proceso de extraccion nuevamente',
      confirmButtonColor: '#DC3545',
      confirmButtonText: 'Confirmar',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.route.navigateByUrl('/dashboard/reglas');
      }
    })
  }

  cambiarPagina($event) {
    this.pageActual = $event;
  }

  cambiarPaginaExc($event) {
    this.pageActualExc = $event;
  }

  onKeyUp() {
    this.pageActual = 1;
  }

  upload() {
    Swal.fire({
      icon: 'info',
      title: 'Por Favor Espere...',
      text: 'Cargando Exclusiones!',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFiles.item(0);
    console.log(this.currentFileUpload.name);

    this.reglasSrv.cargarExclusiones(this.currentFileUpload, this.user_actual).subscribe(resp => {
      this.list_exclusiones = resp;
      console.log(this.list_exclusiones);

      this.exclusiones_cargadas = true;
      Swal.fire({
        icon: 'success',
        title: 'OK',
        text: 'Cargado Correctamente!!',
        allowOutsideClick: false
      });
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'Upsss..',
        text: `Error procesando el archivo ${this.currentFileUpload.name}`,
        allowOutsideClick: false
      });
    }
    );
  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  cargarExclusiones() {
    this.mostrarExclusiones = true;
  }

  irParametrizacion() {
    this.route.navigateByUrl('/dashboard/calculoIncremento/parametrizacion');
  }

  continuarCalculoIncremento() {
    this.route.navigateByUrl('/dashboard/calculoIncremento/interfaces');
  }

}