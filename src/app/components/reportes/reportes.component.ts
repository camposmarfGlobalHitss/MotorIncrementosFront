import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReglasService } from '../../services/reglas.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'
import { Regla } from '../../classes/regla';
import { InterfacesService } from 'src/app/services/interfaces.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  constructor(private interfacSrv: InterfacesService){

  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

   selectOpcion(selectOpt: any) {
    if (selectOpt === '1') {
      this.generarRepCtasIncremento();
    } else if (selectOpt === '2') {
      this.generarRepCtasNoCumplenPoliticas();
    } else if (selectOpt === '3') {
      this.generarRepCtasSujIncremento();
    } else if (selectOpt === '4') {
      this.generarRepCtasNoSujIncremento();
    } else if (selectOpt === '5') {
      this.generarRepCtrlFyM();
    } else {
      alert('seleccione una opcion valida')
    }
  }

  generarArchivos(seleccion: any) {
    if (seleccion === '0') {
      alert('por favor seleccione una opcion valida');
    } else if (seleccion === '2') {
      this.generarInformePreIncremento();
    }
  }

  generarRepCtasIncremento() {

    Swal.fire({
      icon: 'info',
      title: 'Por favor espere!!',
      text: 'Generando Reporte Cuentas Incremento',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.interfacSrv.generarRepCtasIncremento().subscribe(resp => {
      Swal.fire({
        icon: 'success',
        title: 'EXITO!!',
        text: resp
      });
    })
  }

  generarRepCtasNoCumplenPoliticas() {
    Swal.fire({
      icon: 'info',
      title: 'Por favor espere!!',
      text: 'Generando Reporte de cuentas no incrementadas...',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.interfacSrv.generarRepCtasNoCumplenPoliticas().subscribe(resp => {
      Swal.fire({
        icon: 'success',
        title: 'EXITO!!',
        text: resp
      });
    })

  }

  generarRepCtasSujIncremento() {
    Swal.fire({
      icon: 'info',
      title: 'Por favor espere!!',
      text: 'Generando Reporte de Cuentas sujetas a incremento',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.interfacSrv.generarRepCtasSujIncremento().subscribe(resp => {
      Swal.fire({
        icon: 'success',
        title: 'EXITO!!',
        text: resp
      });
    })
  }

  generarRepCtasNoSujIncremento() {
    Swal.fire({
      icon: 'info',
      title: 'Por favor espere!!',
      text: 'Generando Reporte de cuentas no sujetas a incremento',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.interfacSrv.generarRepCtasNoSujIncremento().subscribe(resp => {
      Swal.fire({
        icon: 'success',
        title: 'EXITO!!',
        text: resp
      });
    })
  }

  generarRepCtrlFyM() {
    Swal.fire({
      icon: 'info',
      title: 'Por favor espere!!',
      text: 'Generando Reportes de control de fija y movil',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.interfacSrv.generarRepCtrlFyM().subscribe(resp => {
      Swal.fire({
        icon: 'success',
        title: 'EXITO!!',
        text: resp
      });
    })
  }

  generarInformePreIncremento() {
    Swal.fire({
      icon: 'info',
      title: 'Por favor espere!!',
      text: 'Generando Informe Pre Incremento',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.interfacSrv.generarInformePreIncremento().subscribe(resp => {
      Swal.fire({
        icon: 'success',
        title: 'EXITO!!',
        text: resp
      });
    }, error => {
      console.log(error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.error
      })
    });
  }


}