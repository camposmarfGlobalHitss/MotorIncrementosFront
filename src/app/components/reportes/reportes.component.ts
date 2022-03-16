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
      alert('por favor seleccione una opcion válida');
    } else if (seleccion === '2') {      
      this.generarInformePreIncremento();
    }
  }

  generarRepCtasIncremento() {
    /*
      @Luz.Obredor 09.03.2022
      Funcionalidad que permite generar reporte en el cliente
    */
    Swal.fire({
      icon: 'info',
      title: 'Por favor espere!',
      text: 'Generando Reporte Cuentas Incremento',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.interfacSrv.generarRepCtasIncremento().subscribe(resp => {
      const url = window.URL.createObjectURL(resp)
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = 'reporte_cuentas_con_incremento.csv'
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
      Swal.fire({
        icon: 'success',
        title: 'EXITO!'
      });     
    }, error=>{
      Swal.fire({
        icon: 'error',
        title: 'ERROR!',
        text: error.error
      });
    })
  }

  generarRepCtasNoCumplenPoliticas() {
    /*
      @Luz.Obredor 09.03.2022
      Funcionalidad que permite generar reporte en el cliente
    */
    Swal.fire({
      icon: 'info',
      title: 'Por favor espere!',
      text: 'Generando Reporte de cuentas no incrementadas...',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.interfacSrv.generarRepCtasNoCumplenPoliticas().subscribe(resp => {      
      const url = window.URL.createObjectURL(resp)
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = 'reporte_cuentas_no_cumplen_politicas.csv'
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
      Swal.fire({
        icon: 'success',
        title: 'EXITO!'
      });
    }, error=>{
      Swal.fire({
        icon: 'error',
        title: 'ERROR!',
        text: error.error
      })
    })
  }

  generarRepCtasSujIncremento() {
    Swal.fire({
      icon: 'info',
      title: 'Por favor espere!',
      text: 'Generando Reporte de Cuentas sujetas a incremento',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.interfacSrv.generarRepCtasSujIncremento().subscribe(resp => {
      Swal.fire({
        icon: 'success',
        title: 'EXITO!',
        text: resp
      });
    }, error=>{
      Swal.fire({
        icon: 'error',
        title: 'ERROR!',
        text: error.error
      })
    })
  }

  generarRepCtasNoSujIncremento() {
    /*
      @Luz.Obredor 09.03.2022
      Funcionalidad que permite generar reporte en el cliente
    */
    Swal.fire({
      icon: 'info',
      title: 'Por favor espere!',
      text: 'Generando Reporte de cuentas no sujetas a incremento',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.interfacSrv.generarRepCtasNoSujIncremento().subscribe(resp => {
      const url = window.URL.createObjectURL(resp)
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = 'reporte_cuentas_no_sujetas_incremento.csv'
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
      Swal.fire({
        icon: 'success',
        title: 'EXITO!'
      });
    }, error=>{
      Swal.fire({
        icon: 'error',
        title: 'ERROR!',
        text: error.error
      })
    })
  }

  generarRepCtrlFyM() {
    Swal.fire({
      icon: 'info',
      title: 'Por favor espere!',
      text: 'Generando Reportes de control de fija y movil',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.interfacSrv.generarRepCtrlFyM().subscribe(resp => {
      Swal.fire({
        icon: 'success',
        title: 'EXITO!',
        text: resp
      });
    }, error=>{
      Swal.fire({
        icon: 'error',
        title: 'ERROR!',
        text: error.error
      })
    })
  }

  generarInformePreIncremento() {
    /*
      @Luz.Obredor 09.03.2022
      Funcionalidad que permite generar reporte en el cliente
    */
    Swal.fire({
      icon: 'info',
      title: 'Por favor espere!',
      text: 'Generando Informe Pre Incremento',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.interfacSrv.generarInformePreIncremento().subscribe(resp => {
      const url = window.URL.createObjectURL(resp)
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = 'reporte_pre_incremento.csv'
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
      Swal.fire({
        icon: 'success',
        title: 'EXITO!'
      });
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'ERROR!',
        text: error.error
      })
    });
  }
}