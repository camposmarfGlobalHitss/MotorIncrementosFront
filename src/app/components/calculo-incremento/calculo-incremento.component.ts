import { Component, OnInit } from '@angular/core';
import { CalculoIncremento } from 'src/app/classes/calculo-incremento';
import { ReglasService } from '../../services/reglas.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Exclusiones } from 'src/app/classes/exclusiones';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, THEME } from 'ng-wizard';

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

  configs: NgWizardConfig = {
    selected: 0,
    theme: THEME.circles,
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Continuar', class: 'btn btn-success', event: () => { } }
      ],
      showNextButton: false,
      showPreviousButton: false
    },
    anchorSettings: {
      anchorClickable: true,
    }
  };

  isValidTypeBoolean: boolean = true;

  constructor(private reglasSrv: ReglasService,
              private route: Router,
              private activateRoute: ActivatedRoute,
              private ngWizardService: NgWizardService) {
    this.activateRoute.params.subscribe(param => {
      this.parametroUrl = +param.parametrizacion;
    });
    this.data_cargada = false;
    this.mostrarExclusiones = false;
    this.user_actual = localStorage.getItem('usuario');
    switch (this.parametroUrl) {
      case 0:
        this.parametrizacionRelizada = false;
        this.cargaMensaje = 'Cargando resultado de aplicación de reglas!';
        this.mostrarMensajeCargando(this.cargaMensaje);
        this.reglasSrv.traerCuentasPostExtraccion().subscribe(resp => {
          this.list_cal_inc = resp;
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'Datos cargados correctamente!',
            allowOutsideClick: false
          });
          this.data_cargada = true;
        }, err => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Upsss..',
            text: 'Error procesando la solicitud, intente más tarde',
            allowOutsideClick: false
          });
        });
        break;
      case 1:
        this.parametrizacionRelizada = true;
        this.cargaMensaje = 'Cargando datos!';
        this.mostrarMensajeCargando(this.cargaMensaje);
        this.reglasSrv.traerCuentasPostExtraccion().subscribe(resp => {
          this.list_cal_inc = resp;
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'Datos cargados correctamente!',
            allowOutsideClick: false
          });
          this.data_cargada = true;
        }, err => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Upsss..',
            text: 'Error procesando la solicitud, intente más tarde',
            allowOutsideClick: false
          });
        });
        break;
      case 2:
        this.parametrizacionRelizada = true;
        this.cargaMensaje = 'Cargando datos corregidos!';
        this.reglasSrv.traerCuentasCorregidas().subscribe(resp => {
          this.list_cal_inc = resp;
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'Datos cargados correctamente!',
            allowOutsideClick: false
          });
          this.data_cargada = true;
        }, err => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Upsss..',
            text: 'Error procesando la solicitud, intente más tarde',
            allowOutsideClick: false
          });
        });
        break;
    }
  }


  ngOnInit(): void {
  }


  mostrarMensajeCargando(mensaje: string) {
    Swal.fire({
      icon: 'info',
      title: 'Por favor espere...',
      text: mensaje,
      allowOutsideClick: false
    });
    Swal.showLoading();
  }

  cancelarCalculo() {
    Swal.fire({
      title: '¿Realmente desea cancelar el proceso?',
      text: 'si cancela tendrá que volver a empezar todo el proceso de extracción nuevamente',
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
    this.reglasSrv.cargarExclusiones(this.currentFileUpload, this.user_actual).subscribe(resp => {
      this.list_exclusiones = resp;
      this.exclusiones_cargadas = true;
      Swal.fire({
        icon: 'success',
        title: 'OK',
        text: 'Cargado Correctamente!',
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
    this.route.navigateByUrl(`/dashboard/calculoIncremento/interfaces/${this.parametroUrl}`);
  }

  stepChanged(args: StepChangedArgs) {
    this.configs.toolbarSettings.toolbarExtraButtons = []
    if (args.step.index == 0) {
      this.configs.toolbarSettings.toolbarExtraButtons.push({ text: 'Continuar', class: 'btn btn-success', event: () => { this.showNextStep() } })
    } else {
      if (this.data_cargada) {
        if (!this.parametrizacionRelizada) {
          this.configs.toolbarSettings.toolbarExtraButtons.push({ text: 'Cancelar', class: 'btn btn-danger', event: () => { this.cancelarCalculo() } })
          this.configs.toolbarSettings.toolbarExtraButtons.push({ text: 'Parametrización del cálculo', class: 'btn btn-primary', event: () => { this.irParametrizacion() } })
        } else {
          this.configs.toolbarSettings.toolbarExtraButtons.push({ text: 'Continuar', class: 'btn btn-success', event: () => { this.continuarCalculoIncremento() } })
        }
      }
    }
  }

  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
  }

  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event?: Event) {
    this.ngWizardService.next();
  }

  resetWizard(event?: Event) {
    this.ngWizardService.reset();
  }

  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }
}