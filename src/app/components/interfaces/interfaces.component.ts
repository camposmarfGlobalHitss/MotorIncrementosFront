import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Papa } from 'ngx-papaparse';
import { CalculoincrementoService } from 'src/app/services/calculoincremento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-interfaces',
  templateUrl: './interfaces.component.html',
  styleUrls: ['./interfaces.component.css']
})
export class InterfacesComponent {
  
  selectedCSVFileName:string='';
  resultadoLectura:string='';
  isCSV_Valid:boolean;
  MostrarContenido:boolean=false;
  constructor(private papa:Papa, private calculoSrv:CalculoincrementoService, private router:Router){
    const csvData = '';
    this.MostrarContenido = false;

    this.papa.parse(csvData,{
      complete: (result) => {
          console.log('Parsed: ', result);
      }
  });
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
            console.log( 'Error Parsing CSV File: ',results.errors[i].message);
          }
        }
      };
    } else {
      console.log('No File Selected');
    }

  }


  generarArchivoPLM(){
    Swal.fire({
      icon: 'info',
      title: 'Por Favor Espere...',
      text: 'Generando Archivo PLM',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.calculoSrv.generarArchivoPlanoPLM().subscribe(resp=>{
       Swal.fire({
         icon:'success',
         title:'OK',
         text:resp,
         allowOutsideClick:false
       }); 
    },err=>{
      Swal.fire({
        icon:'error',
        title:'upss..!!',
        text:'error al generar el archivo, por favor intente mas tarde',
        allowOutsideClick:false
      });
    });
    

  }


  finalizarProceso(){

    Swal.fire({
      text:'Realmente desea Finalizar el proceso',
      confirmButtonColor:'#5062F7',
      confirmButtonText:'Confirmar',
      showConfirmButton:true,
      showCancelButton:true,
      allowOutsideClick:false      
    }).then(result=>{
      if(result.isConfirmed){
        this.router.navigateByUrl('/dashboard');
      }
    })
  }


}



