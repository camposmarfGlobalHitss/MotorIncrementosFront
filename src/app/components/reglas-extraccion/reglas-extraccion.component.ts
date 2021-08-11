import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReglasService } from 'src/app/services/reglas.service';
import { Regla } from '../../classes/regla';
import Swal from 'sweetalert2';
import { CalculoIncremento } from '../../classes/calculo-incremento';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { LoginService } from '../../services/login.service';
import { Exclusiones } from '../../classes/exclusiones';

@Component({
  selector: 'app-reglas-extraccion',
  templateUrl: './reglas-extraccion.component.html',
  styleUrls: ['./reglas-extraccion.component.css']
})
export class ReglasExtraccionComponent implements OnInit {
  pageActual:number=1;
  paginaActualModal:number=1;
  filterTabla:string='';
  listReglas:Regla[];
  seleccionado:any;
  forma:FormGroup;
  reglaSeleccionada:Regla;
  cantidad_registros:number=0;
  list_calculo:CalculoIncremento[] = [];


  user_actual:string ='';

  list_exclusiones:Exclusiones[]  = [];

  constructor(private router:Router,public modal:NgbModal,
              private reglasSrv:ReglasService, private fb:FormBuilder,
              private loginSrv:LoginService) {
    this.cargarListaCondiciones();
    this.user_actual = localStorage.getItem('usuario');    
  }

  cargarListaCondiciones(){
    this.reglasSrv.listarCondiciones().subscribe(resp=>{
      this.listReglas = resp;          
    });
  }

  ngOnInit(): void {
  }

  irCrearRegla(){
    this.router.navigateByUrl('/dashboard/creareglas');
  }

  openLG(contenido, regla:Regla){
    this.modal.open(contenido, {size:'lg', scrollable:true, centered:true});
    this.cargarFormulario(regla);
    this.reglaSeleccionada = regla;
  }

  actualizarCondicion(){
    Swal.fire({
      icon: 'info',
      title: 'Espere...',
      text: 'Validando Informacion!',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.reglaSeleccionada.regla = this.forma.value.descripcion;
    this.reglaSeleccionada.condicion = this.forma.value.condicion;
    this.reglaSeleccionada.fechaActualizacion = new Date();
    this.reglaSeleccionada.usuarioActualizacion = localStorage.getItem('usuario');
    if(this.forma.invalid){
      return;
    }else{
      this.reglasSrv.chequearCondicion(this.reglaSeleccionada.condicion).subscribe(respCheq=>{
        this.reglasSrv.actualizarCondicion(this.reglaSeleccionada).subscribe(resp=>{
          console.log(resp);
          
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'Editado Correctamente!!',
            allowOutsideClick: false
          });
          this.modal.dismissAll();
          this.cargarListaCondiciones();
        },err=>{
          console.log(err);        
          Swal.fire({
            icon: 'error',
            title: 'Upsss..',
            text: err.error,
            allowOutsideClick: false  
          });
        }
        );
      },error=>{
        Swal.fire({
          icon: 'error',
          title: 'Upsss..',
          text: error.error,
          allowOutsideClick: false  
        });
      }
      );
      
    }
    
    
  }

  borrarCondicion(regla:Regla){
    Swal.fire({
      title:'Desea eliminar la condicion seleccionada?',
      confirmButtonColor:'#DC3545',
      confirmButtonText:'Eliminar',
      showConfirmButton:true,
      showCancelButton:true,
      allowOutsideClick:false
    }).then((result)=>{
      if(result.isConfirmed){
        this.reglasSrv.borrarCondicion(regla.id).subscribe(resp=>{
          console.log(resp);
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: resp,
            allowOutsideClick: false
          });
          this.cargarListaCondiciones();
        },err=>{
          Swal.fire({
            icon: 'error',
            title: 'Upsss..',
            text: err.error,
            allowOutsideClick: false  
          });
        });
      }
    });
  }

  cargarFormulario(regla:Regla){    
    this.forma = this.fb.group({
      descripcion :[regla.regla,Validators.required],
      condicion : [regla.condicion, Validators.required]
    });
  }

  extraccionCuentas(){
    Swal.fire({
      title:'Desea ejecutar la extraccion de cuentas?',
      confirmButtonColor:'#5062F7',
      confirmButtonText:'Confirmar',
      showConfirmButton:true,
      showCancelButton:true,
      allowOutsideClick:false
    }).then((result)=>{
      if(result.isConfirmed){
        Swal.fire({
          icon: 'info',
          title: 'Por favor espere...',
          text: 'Ejecutando proceso!',
          allowOutsideClick: false
        });
        Swal.showLoading();
        this.reglasSrv.extraccionCuentas().subscribe(resp=>{
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: resp,
            allowOutsideClick: false
          });
          this.router.navigateByUrl('/dashboard/calculoIncremento');
        },err=>{
          Swal.fire({
            icon: 'error',
            title: 'Upsss..',
            text: err.error,
            allowOutsideClick: false  
          });
        })
      }
    })
  }


  validarCondiciones(carga){
    Swal.fire({
      icon: 'info',
      title: 'Por favor espere...',
      text: 'CARGANDO DATOS CON LAS CONDICIONES ACTUALES..',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.reglasSrv.validarCondicionesActuales().subscribe(resp=>{
      this.list_calculo = resp;
      this.cantidad_registros = this.list_calculo.length;
      Swal.fire({
        icon: 'success',
        title: 'OK',
        text: 'DATOS CARGADOS CORRECTAMENTE',
        allowOutsideClick: false
      });
      this.modal.open(carga, {size:'lg', scrollable:true, centered:true});

    },err=>{
      console.log(err);
      
      Swal.fire({
        icon: 'error',
        title: 'Upsss..',
        text: err.statusText,
        allowOutsideClick: false  
      });
    });
    
  }

  
  

}
