import { Component, OnInit } from '@angular/core';
import { ExtraccionInformacionService } from '../../services/extraccion-informacion.service';
import { Auditoria } from '../../classes/auditoria';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-extraccion-informacion',
  templateUrl: './extraccion-informacion.component.html',
  styleUrls: ['./extraccion-informacion.component.css']
})
export class ExtraccionInformacionComponent implements OnInit {

  ListExtraccionInfo:Auditoria[]=[];
  seleccionado:any;
  resultExtract:string ='';
  constructor(private extractInfoService:ExtraccionInformacionService) { 
      
    this.cargarListExtraccionInfo();
  }

  ngOnInit(): void {
  }

  cargarListExtraccionInfo(){
    this.extractInfoService.traerInformacion().subscribe((resp:Auditoria[]) =>{
      this.ListExtraccionInfo = resp;
    });
  }

  extraerInfo(){
    Swal.fire({
      icon: 'info',
      title: 'Espere...',
      text: 'Validando Informacion! - Esto puede tardar un par de minutos...',
      allowOutsideClick: false
    });

    Swal.showLoading();


    console.log(this.seleccionado);
    if(this.seleccionado === '1'){     
      this.extractInfoService.extraccionClientes().subscribe(resp=>{
        this.resultExtract = resp;
        console.log(resp);
        
        if(this.resultExtract === 'OK'){
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'La extraccion de clientes se realizo correctamente!!',
            allowOutsideClick: false
          });
          this.cargarListExtraccionInfo();
        }else{
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'La extraccion de clientes se realizo correctamente entro por el else!!',
            allowOutsideClick: false
          });
        }
      },err=>{
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Upsss..',
          text: 'Ah Ocurrido un error, Intenta mas tarde!',
          allowOutsideClick: false
        });
      }
      );
      
    }else if(this.seleccionado === '2'){
        console.log("SELECCIONO IMT_TBL_CONTRATOS");
       


    }else if(this.seleccionado ==='3'){
      console.log("SELECCIONO IMT_TB_PRODUCTO_OFERTA");
      this.extractInfoService.extraccionProductoOferta().subscribe(resp=>{
        this.resultExtract = resp;
        console.log(resp);          
        Swal.fire({
          icon: 'success',
          title: 'OK',
          text: 'La extraccion de Producto oferta se realizo correctamente!!',
          allowOutsideClick: false
        });
        this.cargarListExtraccionInfo();
      },err=>{
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Upsss..',
          text: 'Ah Ocurrido un error, Intenta mas tarde!',
          allowOutsideClick: false
        });
      });


    }else{
      console.log("no selecciono nada");
      
    }
    
  }

}
