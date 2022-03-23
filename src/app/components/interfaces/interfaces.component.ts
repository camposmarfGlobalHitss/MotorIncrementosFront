import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Papa } from 'ngx-papaparse';
import { CalculoincrementoService } from 'src/app/services/calculoincremento.service';
import Swal from 'sweetalert2';
import { InterfacesService } from '../../services/interfaces.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-interfaces',
  templateUrl: './interfaces.component.html',
  styleUrls: ['./interfaces.component.css']
})
export class InterfacesComponent implements OnInit {

  selectedCSVFileName: string = '';
  resultadoLectura: string = '';
  isCSV_Valid: boolean;
  MostrarContenido: boolean = false;
  parametroUrl:number

  constructor(private papa: Papa, 
    private calculoSrv: CalculoincrementoService, 
    private route: Router,
    private activateRoute: ActivatedRoute) {
    this.activateRoute.params.subscribe(param => {
      this.parametroUrl = +param.parametro;
    });
    const csvData = '';
    this.MostrarContenido = false;
    this.papa.parse(csvData, {
      complete: (result) => {
        console.log('Parsed: ', result);
      }
    });
  }

  ngOnInit(): void {
    /*
      @Luz.Obredor 16.02.2022
      Funcionalidad que permite validar si el usuario ha ejecutado correctamente el cálculo de incremento
      si la respuesta es positiva da paso a la visualización del módulo de generación de interfaces, reportes y archivos
      por el contrario si es negativa la funcionalidad redirige al usuario para que realice la ejecución tanto para fija como móvil.
    */
    Swal.fire({
      text: "¿La parametrización de la ejecución del cálculo de incrementos está completa?",
      icon: "info",      
      showCancelButton:true,
      cancelButtonText: "Sí",      
      showConfirmButton: true,
      confirmButtonText: "No",
      preConfirm: () => {
        this.route.navigateByUrl('/dashboard/calculoIncremento/ejecucion');
      }     
    })
  }

  fileChangeListener($event: any): void {
    this.MostrarContenido = true;
    const files = $event.srcElement.files;

    if (files !== null && files !== undefined && files.length > 0) {
      this.selectedCSVFileName = files[0].name;

      const reader: FileReader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = e => {

        const csv = reader.result;
        const results = this.papa.parse(csv as string, { header: false });
        this.resultadoLectura = csv.toString();
        // VALIDATE PARSED CSV FILE
        if (results !== null && results !== undefined && results.data !== null &&
          results.data !== undefined && results.data.length > 0 && results.errors.length === 0) {
          this.isCSV_Valid = true;

          // PERFORM OPERATIONS ON PARSED CSV
          let csvTableHeader = results.data[0];

          let csvTableData = [...results.data.slice(1, results.data.length)];
          console.log(results);

        } else {
          for (let i = 0; i < results.errors.length; i++) {
            console.log('Error Parsing CSV File: ', results.errors[i].message);
          }
        }
      };
    } else {
      console.log('No File Selected');
    }
  }

  generarArchivoPLM() {
    Swal.fire({
      icon: 'info',
      title: 'Por Favor Espere...',
      text: 'Generando Archivo PLM',
      allowOutsideClick: false
    });
    Swal.showLoading();
    if(this.parametroUrl == 2){
      this.calculoSrv.generarArchivoPlanoPLMCorregido().subscribe(resp => {
        Swal.fire({
          icon: 'success',
          title: 'OK',
          text: resp,
          allowOutsideClick: false
        });
      }, err => {
        Swal.fire({
          icon: 'error',
          title: 'upss..!!',
          text: 'error al generar el archivo, por favor intente mas tarde',
          allowOutsideClick: false
        });
      });
    }else{
      this.calculoSrv.generarArchivoPlanoPLM().subscribe(resp => {
        Swal.fire({
          icon: 'success',
          title: 'OK',
          text: resp,
          allowOutsideClick: false
        });
      }, err => {
        Swal.fire({
          icon: 'error',
          title: 'upss..!!',
          text: 'error al generar el archivo, por favor intente mas tarde',
          allowOutsideClick: false
        });
      });
    }
  }

  finalizarProceso() {
    Swal.fire({
      text: '¿Realmente desea finalizar el proceso de incremento?',
      confirmButtonColor: '#5062F7',
      confirmButtonText: 'Confirmar',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }).then(result => {
      if (result.isConfirmed) {
        this.route.navigateByUrl('/dashboard');
      }
    })
  }

}