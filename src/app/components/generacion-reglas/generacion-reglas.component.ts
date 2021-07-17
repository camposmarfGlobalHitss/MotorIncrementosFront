import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReglasService } from '../../services/reglas.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'
import { Regla } from '../../classes/regla';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-generacion-reglas',
  templateUrl: './generacion-reglas.component.html',
  styleUrls: ['./generacion-reglas.component.css']
})
export class GeneracionReglasComponent implements OnInit {

  mostrarReglasSql:Boolean = false;
  condicionesActuales:string;
  BanderaCreaRegla:boolean;
  resultadoChequeo:string;
  regla:Regla={};
  respSrvCrear:Regla ={};
  forma:NgForm;
  constructor(private router:Router, private reglassrv:ReglasService,
              private loginsrv:LoginService) {
    this.mostrarReglasSql = false;
    this.BanderaCreaRegla = true;
    this.reglassrv.getCondicionesActuales().subscribe(resp =>{
      this.condicionesActuales = resp;
    });
    
    
   }

  ngOnInit(): void {
  }

  volverReglas(){
    this.router.navigateByUrl('/dashboard/reglas');
  }

  MostrarOcultarSql(){
    this.mostrarReglasSql = !this.mostrarReglasSql;
  }

  validar(forma :NgForm){
    console.log(forma.value);
    this.forma = forma;
    if(forma.invalid){
      Object.values(forma.controls).forEach(control=>{
        control.markAsTouched();
      });
    }else{
      Swal.fire({
        icon: 'info',
        title: 'Espere...',
        text: 'Validando Informacion!',
        allowOutsideClick: false
      });
  
      Swal.showLoading();

      this.reglassrv.chequearCondicion(forma.value.condicion).subscribe(resp =>{
        
        this.resultadoChequeo = resp;
        console.log(this.resultadoChequeo);
        Swal.fire({
          icon: 'success',
          title: 'OK',
          text: this.resultadoChequeo,
          allowOutsideClick: false
        });
        this.BanderaCreaRegla = false;
        this.regla.condicion = forma.value.condicion;
        this.regla.regla = forma.value.descripcionRegla;
        this.regla.fechaCreacion = new Date();
        this.regla.usuarioCreacion = localStorage.getItem('usuario');
        this.regla.servicioAfectado = forma.value.servicio;
        this.reglassrv.getCondicionesActuales().subscribe(resp =>{
          this.condicionesActuales = resp;
        });
      },error=>{
      
        
        Swal.fire({
          icon: 'error',
          title: 'Upsss..',
          text: error.error,
          allowOutsideClick: false  
        });
      });
      
       
    }
    
  }

  crearRegla(){
    Swal.fire({
      icon: 'info',
      title: 'Espere...',
      text: 'Validando Informacion!',
      allowOutsideClick: false
    });

    Swal.showLoading();
    this.reglassrv.crearCondicion(this.regla).subscribe(resp=>{
      this.respSrvCrear = resp;
      console.log(resp);
      Swal.fire({
        icon: 'success',
        title: 'OK',
        text: 'CONDICION CREADA CORRECTAMENTE!!',
        allowOutsideClick: false,
        
      });
      this.router.navigateByUrl('/dashboard/reglas');
      this.forma.reset();
    })
  }

}
