import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ReglasService } from 'src/app/services/reglas.service';
import { Regla } from '../../classes/regla';
import Swal from 'sweetalert2';
import { CalculoIncremento } from '../../classes/calculo-incremento';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { LoginService } from '../../services/login.service';
import { Exclusiones } from '../../classes/exclusiones';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { of } from 'rxjs';
import { BizService } from 'src/app/services/biz.service';

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
  
  isValidTypeBoolean: boolean = true;

  user_actual:string ='';

  list_exclusiones:Exclusiones[]  = [];

  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden
  };
 
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
    anchorSettings:{ 
      anchorClickable: true, 
    }
  };

  mostrarReglasSql:Boolean = false;
  condicionesActuales:string;
  BanderaCreaRegla:boolean;
  resultadoChequeo:string;
  regla:Regla={};
  respSrvCrear:Regla ={};
  forma2:NgForm;

  constructor(private router:Router,private modal:NgbModal, private config: NgbModalConfig,
              private reglasSrv:ReglasService, private fb:FormBuilder,
              private loginSrv:LoginService,
              private ngWizardService: NgWizardService) {
                config.backdrop = 'static'
                config.keyboard = false;
    this.cargarListaCondiciones();
    this.user_actual = localStorage.getItem('usuario');  
    this.mostrarReglasSql = false;
    this.BanderaCreaRegla = true;
    this.reglasSrv.getCondicionesActuales().subscribe(resp =>{
      this.condicionesActuales = resp;
    });
    

  }

  cargarListaCondiciones(){
    this.reglasSrv.listarCondiciones().subscribe(resp=>{
      this.listReglas = resp;          
    });
  }

  ngOnInit(): void {
  }

  irCrearRegla(creacion){
    this.modal.open(creacion, {size:'lg', scrollable:true, centered:true});
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
      title:'¿Desea ejecutar la extracción de cuentas?',
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
          this.router.navigateByUrl('/dashboard/calculoIncremento/calculo/0');
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

  validarCondiciones(){ 
    this.showNextStep();
    Swal.fire({
      icon: 'info',
      title: 'Por favor espere...',
      text: 'Cargando datos con las condiciones actuales...',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.reglasSrv.validarCondicionesActuales().subscribe(resp=>{
      this.list_calculo = resp;
      this.cantidad_registros = this.list_calculo.length;
      Swal.fire({
        icon: 'success',
        title: 'OK',
        text: 'Datos cargados correctamente!',
        allowOutsideClick: false
      });
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

  cambiarPaginaReglasAct($event){
    this.pageActual = $event;  
  }

  cambiarPaginaValidaRegla($event){
    this.paginaActualModal = $event;
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
 
  stepChanged(args: StepChangedArgs) {
    this.configs.toolbarSettings.toolbarExtraButtons = []
    if(args.step.index == 0){
      this.configs.toolbarSettings.toolbarExtraButtons.push({ text: 'Validar Reglas', class: 'btn btn-warning', event: () => { this.validarCondiciones() } })
    }else{
      this.configs.toolbarSettings.toolbarExtraButtons.push({ text: 'Finalizar', class: 'btn btn-success', event: () => { this.extraccionCuentas() } })
    }    
  }
 
  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
  }
 
  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return of(true);
  }

  volverReglas(){
    this.router.navigateByUrl('/dashboard/reglas');
  }

  MostrarOcultarSql(){
    this.mostrarReglasSql = !this.mostrarReglasSql;
  }

  validar(forma :NgForm){
    console.log(forma.value);
    this.forma2 = forma;
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

      this.reglasSrv.chequearCondicion(forma.value.condicion).subscribe(resp =>{
        
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
        this.reglasSrv.getCondicionesActuales().subscribe(resp =>{
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
    this.reglasSrv.crearCondicion(this.regla).subscribe(resp=>{
      this.respSrvCrear = resp;
      console.log(resp);
      Swal.fire({
        icon: 'success',
        title: 'OK',
        text: 'CONDICION CREADA CORRECTAMENTE!!',
        allowOutsideClick: false,
        
      });
      this.router.navigateByUrl('/dashboard/reglas');
      this.forma2.reset();
    })
  }
  
}