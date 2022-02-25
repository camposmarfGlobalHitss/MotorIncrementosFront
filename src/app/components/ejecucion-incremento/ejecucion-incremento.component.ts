import { Component, OnInit } from '@angular/core';
import { CalculoincrementoService } from '../../services/calculoincremento.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ParametrosIncrementoFija } from '../../classes/parametros-incremento-fija';
import { ParametrosCalculoMovil } from '../../classes/parametros-calculo-movil';
import { ParametrosCalculoFija } from '../../classes/parametros-calculo-fija';
import { ActivatedRoute, Router } from '@angular/router';
import { MovilRangoIncremento } from '../../classes/movil-rango-incremento';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, THEME } from 'ng-wizard';

@Component({
  selector: 'app-ejecucion-incremento',
  templateUrl: './ejecucion-incremento.component.html',
  styleUrls: ['./ejecucion-incremento.component.css']
})
export class EjecucionIncrementoComponent implements OnInit {
  
  pageActual:number=1;
  pageActualParametrizacionIncrementoFija:number=1;
  pageActualValoresUvt:number=1;
 
  formaParametrosCalculoMovil:FormGroup;
  formaParametrosCalculoFija:FormGroup;

  parametrosCalculoMovil:ParametrosCalculoMovil={};
  parametrosCalculoFija:ParametrosCalculoFija={};

  icontrashPCM:boolean=false;
  icontrashPCF:boolean=false;
  ejecucionCIM:boolean=false;
  ejecucionCIF:boolean=false;
  
  opcionPCM_TipoRedondeo:string = '0';
  opcionPCM_EstadoCalcular:string;
  opcionPCF_EstadoCalcular:string;

  parametroUrl: number;

  configs: NgWizardConfig = {
    selected: 0,
    theme: THEME.default,
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

  constructor(private calculoSrv:CalculoincrementoService, 
    private modal:NgbModal,
    private fb:FormBuilder, 
    private router:Router, 
    private activateRoute: ActivatedRoute,
    private ngWizardService: NgWizardService) {
      this.activateRoute.params.subscribe(param => {
        this.parametroUrl = +param.parametro;
      });
    this.opcionPCM_EstadoCalcular = this.opcionPCF_EstadoCalcular = this.parametroUrl === 0 ? 'CALCULADO' : 'CORREGIDO';
    this.cargarFormularios();
  }

  cargarFormularios(){

    this.formaParametrosCalculoMovil = this.fb.group({
      iva:['',Validators.required],
      impoconsumo:['',Validators.required],
      porciondatos:['',Validators.required],
      porcionvoz:['',Validators.required],
      unidadredondeo:['',Validators.required],
      vigenciauvt:['',Validators.required],
      incrementousosdefecto:['',Validators.required],
      tiporedondeo:[this.opcionPCM_TipoRedondeo,Validators.required],
      frecuenciacommit:['',Validators.required],
      estadocalcular:[this.opcionPCM_EstadoCalcular,Validators.required]
    });

    this.formaParametrosCalculoFija = this.fb.group({
        iva:['',Validators.required],
        incrementomaximo:['',Validators.required],
        frecuenciacommit:['',Validators.required],
        estadocalcular:[this.opcionPCF_EstadoCalcular,Validators.required]
    });
  }

  ngOnInit(): void {
    /*
      @Luz.Obredor 16.02.2022
      Funcionalidad que permite validar si el usuario ha parametrizado correctamente el cálculo de incremento
      si la respuesta es positiva da paso a la visualización de la ejecución tanto para fija como móvil
      por el contrario si es negativa la funcionalidad redirige al usuario para que realice la parametrización.
    */
    Swal.fire({
      text: "¿La parametrización del cálculo de incrementos está completa?",
      icon: "info",      
      showCancelButton:true,
      cancelButtonText: "Sí",      
      showConfirmButton: true,
      confirmButtonText: "No",
      preConfirm: () => {
        this.router.navigateByUrl(`/dashboard/calculoIncremento/parametrizacion`);
      }     
    })
  }

  AbrirModal(contenido){
    this.modal.open(contenido,{size:'sm', scrollable:true, centered:true});    
  }

  guardarParametrosCalculoMovil(){

    if(this.formaParametrosCalculoMovil.valid){
      this.parametrosCalculoMovil.iva = this.formaParametrosCalculoMovil.value.iva;
      this.parametrosCalculoMovil.impoconsumo = this.formaParametrosCalculoMovil.value.impoconsumo;
      this.parametrosCalculoMovil.porcion_datos = this.formaParametrosCalculoMovil.value.porciondatos;
      this.parametrosCalculoMovil.porcion_voz = this.formaParametrosCalculoMovil.value.porcionvoz;
      this.parametrosCalculoMovil.unidad_redondeo = this.formaParametrosCalculoMovil.value.unidadredondeo;
      this.parametrosCalculoMovil.vigencia_uvt = this.formaParametrosCalculoMovil.value.vigenciauvt;
      this.parametrosCalculoMovil.incremento_usos_por_defecto = this.formaParametrosCalculoMovil.value.incrementousosdefecto;
      this.parametrosCalculoMovil.tipo_redondeo_usos = this.formaParametrosCalculoMovil.value.tiporedondeo === '1' ? 'NORMAL' : this.formaParametrosCalculoMovil.value.tiporedondeo === '2' ? 'PISO' : 'TECHO';
      this.parametrosCalculoMovil.frecuencia_commit = this.formaParametrosCalculoMovil.value.frecuenciacommit;
      this.parametrosCalculoMovil.estado_a_calcular = this.formaParametrosCalculoMovil.value.estadocalcular;
      this.icontrashPCM = true;
      this.modal.dismissAll();
      this.cargarFormularios();
      
    }else{
      Swal.fire({
        icon:'error',
        title:'campos imcompletos',
        text:'faltan campos por rellenar valide e intente de nuevo'
      })
    }
    
    
  }

  ejecutarPCM(){
    Swal.fire({
      icon: 'info',
      title: 'Espere...',
      text: 'Ejecutando el Proceso!',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.calculoSrv.ejecutarCalculoIncrementoMovil(this.parametrosCalculoMovil).subscribe(resp=>{
      Swal.fire({
        icon:'info',
        title:'OK',
        text:resp
      });
    },err=>{
      Swal.fire({
        icon:'error',
        title:'Upss!!',
        text:'Algo ha salido mal, por favor intente mas tarde'
      });
    });
    this.ejecucionCIM = true;
  }

  abrirModalPCM(contenido4){
      this.cargarFormularios();
      this.modal.open(contenido4,{size:'sm',centered:true, scrollable:true});
  }

  borrarPCM(){
    this.parametrosCalculoMovil = {};
    this.icontrashPCM = false;
  }

  abrirModalPCF(contenido5){
    this.cargarFormularios();
    this.modal.open(contenido5,{size:'sm', centered:true, scrollable:true});
  }

  guardarParametrosCalculoFija(){
    if(this.formaParametrosCalculoFija.valid){
        this.parametrosCalculoFija.iva_oficial = this.formaParametrosCalculoFija.value.iva;
        this.parametrosCalculoFija.incremento_maximo = this.formaParametrosCalculoFija.value.incrementomaximo;
        this.parametrosCalculoFija.frecuencia_commit = this.formaParametrosCalculoFija.value.frecuenciacommit;
        this.parametrosCalculoFija.estado_a_calcular = this.formaParametrosCalculoFija.value.estadocalcular;
        this.icontrashPCF = true;
        this.modal.dismissAll();
        this.cargarFormularios();
      }else{
      Swal.fire({
        icon:'error',
        title:'faltan datos',
        text:'faltan campos por llenar por favor valide e intente de nuevo'
      });
    }
  }

  borrarPCF(){
    this.parametrosCalculoFija = {};
    this.icontrashPCF = false;
  }

  ejcutarPCF(){
    Swal.fire({
      icon: 'info',
      title: 'Espere...',
      text: 'Ejecutando el Proceso!',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.calculoSrv.ejecutarCalculoIncrementoFija(this.parametrosCalculoFija).subscribe(resp=>{
      Swal.fire({
        icon:'info',
        title:'OK',
        text:resp
      });
    },err=>{
      Swal.fire({
        icon:'error',
        title:'Upss!!',
        text:'Algo ha salido mal, por favor intente mas tarde'
      });
    });

    this.ejecucionCIF = true;
  }

  continuarProcesoParametrizacion(){
    this.router.navigateByUrl(`/dashboard/calculoIncremento/calculo/${1}`);
  }
  
  cancelarParametrizacion(){
    Swal.fire({
      title:'¿Desea cancelar la parametrización actual?',
      confirmButtonColor:'#DC3545',
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then(resp=>{
      if(resp.isConfirmed){
        this.router.navigateByUrl(`/dashboard/calculoIncremento/calculo/${0}`);
      }
    });
  }

  stepChanged(args: StepChangedArgs) {
    this.configs.toolbarSettings.toolbarExtraButtons = []
    this.configs.toolbarSettings.toolbarExtraButtons.push({ text: 'Cancelar', class: 'btn btn-danger', event: () => { this.cancelarParametrizacion() }})
    if(args.step.index == 0){
      this.configs.toolbarSettings.toolbarExtraButtons.push({ text: 'Continuar', class: 'btn btn-success', event: () => { this.showNextStep() }})
    }else{
      this.configs.toolbarSettings.toolbarExtraButtons.push({ text: 'Finalizar', class: 'btn btn-success', event: () => { 
        (this.ejecucionCIM && this.ejecucionCIF)
          ? this.continuarProcesoParametrizacion() 
          : Swal.fire({
            icon: 'info',
            title: 'Espere...',
            text: 'No ha parametrizado la ejecución del Proceso!',
            allowOutsideClick: false
          });
      }});
    }
  }

  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
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


}