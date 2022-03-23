import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import Swal from 'sweetalert2';
import { FileStorageService } from '../../services/fileStorageService';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reinyeccion',
  templateUrl: './reinyeccion.component.html',
  styleUrls: ['./reinyeccion.component.css']
})
export class ReinyeccionComponent implements OnInit {

  MostrarContenido: boolean = false;
  validateName: boolean = false;
  actualizoestados: Boolean = false;

  selectedCSVFileName: string = '';
  resultadoLectura: string = '';

  constructor(private papa: Papa,
    private fileStorage: FileStorageService, 
    private router: Router) { }

  ngOnInit(): void {}

  /*
    @Luz.Obredor 15.02.2022
    Este evento permite  realizar el proceso de cargue y lectura del archivo así como,
    el consumo del servicio que permite alojarlo en la ruta del servidor de aplicaciones.
    Tambien valida si existe el archivo creado, enviando notificación de corrección en el nombre
    al usuario.
  */
  fileChangeListener($event: any): void {

    this.MostrarContenido = true;
    const files = $event.srcElement.files;
    this.selectedCSVFileName = files[0].name;

    if (files !== null && files !== undefined && files.length > 0 && this.validateNameFile(files[0].name)) {

      const reader: FileReader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = e => {
        const csv = reader.result;
        this.resultadoLectura = csv.toString();
        this.validateName = true
      }

      this.fileStorage.uploadFile(files[0]).subscribe(data => {
        if(data){        
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'Archivo cargado correctamente!',
            allowOutsideClick: false,
            confirmButtonText: 'Actualizar estados',
            preConfirm: () => {
              Swal.fire({
                icon: 'info',
                title: 'Espere...',
                text: 'Validando Informacion!',
                allowOutsideClick: false
              });          
              Swal.showLoading();
              /*Llamado al job que actualiza los registro con los estados del archivo PLM*/
              this.fileStorage.executeJob().subscribe(resp => {
                this.actualizoestados = (resp === 'true')
                if(this.actualizoestados){
                  Swal.fire({
                    icon: 'success',
                    title: 'OK',
                    text: 'Estados actualizados exitosamente!',
                    allowOutsideClick: false
                  }); 
                }else{
                  console.log(1)
                  Swal.fire({
                    icon: 'error',
                    title: 'Upsss..',
                    text: 'Ha ocurrido un error al actualizar el estado de los registros!',
                    allowOutsideClick: false
                  }); 
                }
              })
            }
          });
        }       
      }, err => {
        if(err.status === 500){
          /*cuando ya existe el archivo creado en el servidor de aplicaciones*/
          Swal.fire({
            icon: 'error',
            title: 'Upsss..',
            text: 'Ha ocurrido un error al cargar el archivo este ya existe, modifique el nombre del archivo por favor!',
            allowOutsideClick: false
          });
        }else{
          /*Cuando no cumple con el formato definido validado desde el servidor*/
          Swal.fire({
            icon: 'error',
            title: 'Upsss..',
            text: 'Ha ocurrido un error al cargar el archivo, no es el archivo correspondiente para el proceso de reinyección!',
            allowOutsideClick: false
          });
        }
      })
    }else{
      Swal.fire({        
        /*Cuando no cumple con el formato definido validado desde el cliente*/
        icon: 'error',
        title: 'Upsss..',
        text: 'Ha ocurrido un error al cargar el archivo, no es el archivo correspondiente para el proceso de reinyección!',
        allowOutsideClick: false
      });
    }
  }

  /*
    @Luz.Obredor 11.02.2022
    Esta función valida a través de expresión regular el nombre del archivo de salida, con el fin de cumplir
    con el formato definido OUT_MTARIFF_BATCH_DDMMYYYYHH24MISS.csv, resibe como único parámetro el nombre del archivo
  */
  validateNameFile(file: string) {
    let exp = /^OUT_IN_MTARIFF_BATCH_([0-2][0-9]|3[0-1])(0[1-9]|1[0-2])(\d{4})([01]?[0-9]|2[0-3])[0-5][0-9]([0-5][0-9])?.csv$/
    return exp.test(file)
  }

  ejecucionIncremento(){
    this.router.navigateByUrl(`/dashboard/calculoIncremento/ejecucion/${1}`);
  }

}