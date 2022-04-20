import { Component, OnInit } from '@angular/core';
import { ExtraccionInformacionService } from '../../services/extraccion-informacion.service';
import { Auditoria } from '../../classes/auditoria';
import Swal from 'sweetalert2'
import { AuditoriaService } from 'src/app/services/auditoria.service';

@Component({
  selector: 'app-extraccion-informacion',
  templateUrl: './extraccion-informacion.component.html',
  styleUrls: ['./extraccion-informacion.component.css']
})
export class ExtraccionInformacionComponent implements OnInit {

  listExtraccionInfo: Auditoria[] = [];
  listExtraccionInfoAnt: Auditoria[] = [];
  seleccionado: any;
  resultExtract: string = '';

  constructor(private extractInfoService: ExtraccionInformacionService
    , private auditoriaService: AuditoriaService) {
    this.cargarListExtraccionInfo();
  }

  ngOnInit(): void {
  }

  async cargarListExtraccionInfo() {
    this.listExtraccionInfo = (await this.extractInfoService.traerInformacion())
  }

  /*
    @Luz.Obredor 10.02.2022
    Se crea método que guarda en tabla IMT_TBL_AUDITORIA registro relacionado 
    a la cantidad de registros extraidos de la tabla IMT_TBL_TARIFAS_USO
    Se obtiene el usuario de la sesión quien ejecuta la extracción CS,
    Luego se consulta la tabla IMT_TBL_AUDITORIA para su visualización
  */
  guardarAuditoria() {
    const user = localStorage.getItem('usuario').toString();
    this.auditoriaService.createAuditoriaCS(user).subscribe();
    this.cargarListExtraccionInfo();
  }

  /*
    @Luz.Obredor 10.02.2022
    se modifica método para una mejor validación, inicia el proceso de validación de información
    siempre que la opción seleccionada no sea la primera, se hace uso de la sentencia switch,
    en lugar del if anidado. aquí se ejecutan todos los procesos de extracción tanto BSCS como CS
  */
  extraerInfo() {
    switch (this.seleccionado) {
      case "1":
        Swal.fire({
          icon: 'info',
          title: 'Espere...',
          text: 'Validando información! - Esto puede tardar un par de minutos...',
          allowOutsideClick: false
        });
        Swal.showLoading();
        this.extractInfoService.extraccionClientes().subscribe(resp => {
          this.resultExtract = resp;
            Swal.fire({
              icon: 'success',
              title: 'OK',
              text: 'La extracción de clientes se realizó correctamente!',
              allowOutsideClick: false
            });
            this.cargarListExtraccionInfo();
        }, err => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Upsss..',
            text: 'Ha ocurrido un error, Intenta mas tarde!',
            allowOutsideClick: false
          });
        });
        break;
      case "2":
        Swal.fire({
          icon: 'info',
          title: 'Espere...',
          text: 'Validando información! - Esto puede tardar un par de minutos...',
          allowOutsideClick: false
        });
        Swal.showLoading();
        this.extractInfoService.extraccionContratos().subscribe(resp => {
          this.resultExtract = resp;
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'La extracción de contratos se realizó correctamente!',
            allowOutsideClick: false
          });
          this.cargarListExtraccionInfo();
        }, err => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Upsss..',
            text: 'Ha ocurrido un error, Intenta mas tarde!',
            allowOutsideClick: false
          });
        });
        break;
      case "3":
        Swal.fire({
          icon: 'info',
          title: 'Espere...',
          text: 'Validando información! - Esto puede tardar un par de minutos...',
          allowOutsideClick: false
        });
        Swal.showLoading();
        this.extractInfoService.extraccionProductoOferta().subscribe(resp => {
          this.resultExtract = resp;
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'La extracción de Producto oferta se realizó correctamente!',
            allowOutsideClick: false
          });
          this.cargarListExtraccionInfo();
        }, err => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Upsss..',
            text: 'Ha ocurrido un error, Intenta mas tarde!',
            allowOutsideClick: false
          });
        });
        break;
      case "4":
        Swal.fire({
          icon: 'info',
          title: 'Espere...',
          text: 'Validando información! - Esto puede tardar un par de minutos...',
          allowOutsideClick: false
        });
        Swal.showLoading();
        this.extractInfoService.extraccionCsOffers().subscribe(resp => {
          this.resultExtract = resp;
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'La extracción de tarifas uso se realizó correctamente!',
            allowOutsideClick: false
          });
          this.guardarAuditoria();
        }, err => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Upsss..',
            text: 'Ha ocurrido un error, Intenta mas tarde!',
            allowOutsideClick: false
          });
        });
        break;
      default:
        Swal.fire({
          icon: 'error',
          title: 'Espere...',
          text: 'Seleccione una opción correcta!',
          allowOutsideClick: false
        });
        break;
    }
  }
}