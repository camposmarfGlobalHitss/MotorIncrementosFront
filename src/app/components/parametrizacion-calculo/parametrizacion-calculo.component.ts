import { Component, OnInit } from '@angular/core';
import { MovilRangoIncremento } from 'src/app/classes/movil-rango-incremento';
import { CalculoincrementoService } from '../../services/calculoincremento.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ParametrosIncrementoFija } from '../../classes/parametros-incremento-fija';
import { Uvts } from 'src/app/classes/uvts';
import { ParametrosCalculoMovil } from '../../classes/parametros-calculo-movil';
import { ParametrosCalculoFija } from '../../classes/parametros-calculo-fija';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parametrizacion-calculo',
  templateUrl: './parametrizacion-calculo.component.html',
  styleUrls: ['./parametrizacion-calculo.component.css']
})
export class ParametrizacionCalculoComponent implements OnInit {
  
  pageActual:number=1;
  pageActualParametrizacionIncrementoFija:number=1;
  pageActualValoresUvt:number=1;
  formaMovilRango:FormGroup;
  formaParametrosIncrementoFija:FormGroup;
  formaValoresUVT:FormGroup; 

  listMovilRangoIncremento:MovilRangoIncremento[] = [];
  listUvts:Uvts[]=[];
  listParametrosIncrementoFija:ParametrosIncrementoFija[] = [];
  movilRangoIncremento:MovilRangoIncremento={};
  parametrosIncFija:ParametrosIncrementoFija={};
  valoruvt:Uvts={};
  parametrizacionMRI:boolean=false;
  parametrosIncrementoFija:boolean=false;
  parametrizacionValoresUvt:boolean=false;
  parametrizacionActualizacionPSO:boolean=false;
  
  UltimaActualizacionProductoSubtipoOferta:string;
  opcionPSO:string = '0';
  opcionPCM_TipoRedondeo:string = '0';
  opcionPCM_EstadoCalcular:string ='0';
  opcionPCF_EstadoCalcular:string = '0';

  constructor(private calculoSrv:CalculoincrementoService, private modal:NgbModal,
    private fb:FormBuilder, private router:Router) { 
    this.parametrizacionMRI=false;  
    this.parametrosIncrementoFija=false;
    this.parametrizacionValoresUvt=false;
    this.parametrizacionActualizacionPSO=false;
    this.cargarListas();
    this.cargarFormularios();
  }


  cargarListas(){   
    
    this.calculoSrv.obtenerMovilRangoIncremento().subscribe(resp =>{
      this.listMovilRangoIncremento = resp;
      
    });


    this.calculoSrv.obtenerParametrosIncrementoFija().subscribe(resp =>{
      this.listParametrosIncrementoFija = resp;
    });

    this.calculoSrv.obtenerValoresUvts().subscribe(resp=>{
      this.listUvts = resp;      
    });

    
    this.calculoSrv.ultimaActualizacionProductoSubtipoOferta().subscribe(resp=>{
      this.UltimaActualizacionProductoSubtipoOferta = resp;
    },err=>{
      console.error('error en procesar la peticion');
    });

  }

  cargarFormularios(){

    this.formaMovilRango = this.fb.group({
      desde:['',Validators.required],
      hasta:['',Validators.required],
      porcentaje:['',Validators.required],
      valor:['',Validators.required],
      fechaDesde:['',Validators.required],
      fechaHasta:['',Validators.required]
    });

    this.formaParametrosIncrementoFija = this.fb.group({
      negocio:['Fija',Validators.required],
      paquete:['',Validators.required],
      servpaquete:['',Validators.required],
      vlrinciva:['',Validators.required],
      umbral:['',Validators.required],
      servicio:['',Validators.required],
      tipoincremento:['Valor',Validators.required],
      vigencia:['',Validators.required],
    });

    this.formaValoresUVT = this.fb.group({
      valorUvt:['',Validators.required],
      annioVigencia:['',Validators.required],
      fechaInicio:['',Validators.required],
      fechaFin:['',Validators.required]
    });

  }

  ngOnInit(): void {
  }
  

  guardarMovilRangoIncremento(){    
    if(this.formaMovilRango.valid){    
      Swal.fire({
        icon: 'info',
        title: 'Espere...',
        text: 'Validando Informacion!',
        allowOutsideClick: false
      });
      Swal.showLoading();  
      
      this.movilRangoIncremento = this.formaMovilRango.value;
      this.movilRangoIncremento.fecha_desde = new Date(this.formaMovilRango.value.fechaDesde);
      this.movilRangoIncremento.fecha_hasta = new Date(this.formaMovilRango.value.fechaHasta);
      const user = localStorage.getItem('usuario').toString();
      this.calculoSrv.guardarMovilRangoIncremento(this.movilRangoIncremento,user).subscribe(resp=>{
        Swal.fire({
          icon: 'success',
          title: 'OK',
          text: resp,
          allowOutsideClick: false
        });
        this.cargarListas();
        this.formaMovilRango.reset();
        this.modal.dismissAll();
      },err=>{
        Swal.fire({
          icon: 'error',
          title: 'Upsss..',
          text: err.error,
          allowOutsideClick: false
        });
      });       
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Upsss..',
        text: 'Falta Diligenciar algunos campos valida e intenta de nuevo',
        allowOutsideClick: false
      });     
    }
    
    
  }

  AbrirModal(contenido){
    this.modal.open(contenido,{size:'sm', scrollable:true, centered:true});    
  }

  borrarMovilRangoIncremento(mri:MovilRangoIncremento){
    Swal.fire({
      title: 'Desea Eliminar este registro?',
      confirmButtonColor:'#DC3545',
      showCancelButton: true,
      confirmButtonText: `Confirmar`,
    }).then(resp=>{     

      if(resp.isConfirmed){
        this.calculoSrv.borrarMovilRangoIncremento(mri).subscribe(resp=>{
          Swal.fire({
            icon: 'info',
            title: 'Espere...',
            text: 'Validando Informacion!',
            allowOutsideClick: false
          });
          Swal.showLoading();
          Swal.fire({
            icon:'success',
            title:'OK',
            text:resp,
            allowOutsideClick:false
          });
          this.cargarListas();
        });
      }
    });
    
  }


  borrarParametrosIncrementoFija(pif:ParametrosIncrementoFija){
    Swal.fire({
      title:'Desea eliminar este Registro?',
      confirmButtonColor:'#DC3545',
      showCancelButton:true,
      confirmButtonText:'Eliminar'
    }).then(resp=>{
      if(resp.isConfirmed){
          Swal.fire({
            icon: 'info',
            title: 'Espere...',
            text: 'Validando Informacion!',
            allowOutsideClick: false
          });
          Swal.showLoading();
          this.calculoSrv.borrarParametrosIncrementoFija(pif).subscribe(resp=>{
            Swal.fire({
              icon: 'success',
              title: 'OK',
              text: resp,
              allowOutsideClick: false
            });
            this.cargarListas();
          });
      }
    });
  }

  aceptarMovilRangoIncremento(acc){
    Swal.fire({
      title:'Desea aceptar la parametrizacion actual de Movil Rango Incremento?',
      confirmButtonColor:'#53A1D1',
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then(resp=>{
      if(resp.isConfirmed){
        this.parametrizacionMRI = true;
        acc.collapseAll();
        acc.toggle('toggle-2');
      }
    });

  }

  cancelarMovilRangoIncremento(){
    Swal.fire({
      title:'Desea cancelar la parametrizacion actual?',
      confirmButtonColor:'#53A1D1',
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then(resp=>{
      if(resp.isConfirmed){
        this.parametrizacionMRI = false;
      }
    });
  }

  guardarParametrosIncrementoFija(){ 
      if(this.formaParametrosIncrementoFija.valid){
        this.parametrosIncFija = this.formaParametrosIncrementoFija.value;
        this.parametrosIncFija.serv_inc_antes_iva = this.formaParametrosIncrementoFija.value.vlrinciva;
        this.parametrosIncFija.servicios_paquete = this.formaParametrosIncrementoFija.value.servpaquete;
        this.parametrosIncFija.tipo_incremento = this.formaParametrosIncrementoFija.value.tipoincremento;
        this.parametrosIncFija.umbral_renta = this.formaParametrosIncrementoFija.value.umbral;  
        this.parametrosIncFija.vigencia = new Date(this.formaParametrosIncrementoFija.value.vigencia);    
        
        Swal.fire({
          icon:'info',
          title:'Espere...',
          text:'Validando Informacion'
        });
        Swal.showLoading();
        const user = localStorage.getItem('usuario').toString();
        this.calculoSrv.guardarParametrosIncremento(this.parametrosIncFija,user).subscribe(resp=>{
          Swal.fire({
            icon:'info',
            title:'OK',
            text:resp
          });
          this.formaParametrosIncrementoFija.reset();
          this.cargarListas();
          this.modal.dismissAll();
        },err=>{
          Swal.fire({
            icon:'error',
            title:'Upss..',
            text:'Se ha producido un error por favor intente mas tarde'
          });
        });
        
      }
      
  }

  AbrirModalParametrosIncrementoFija(contenido2){
    this.cargarFormularios();
    this.modal.open(contenido2,{size:'sm', scrollable:true, centered:true});    
  }

  aceptarParametrosIncrementoFija(acc){
    Swal.fire({
      title:'Desea aceptar la parametrizacion actual de Incremento para Fija?',
      confirmButtonColor:'#53A1D1',
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then(resp=>{
      if(resp.isConfirmed){
        this.parametrosIncrementoFija = true;
        acc.collapseAll();
        acc.toggle('toggle-3');
      }
    });
  }


  cancelarParametrosIncrementoFija(){
    Swal.fire({
      title:'Desea cancelar la parametrizacion actual?',
      confirmButtonColor:'#53A1D1',
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then(resp=>{
      if(resp.isConfirmed){
        this.parametrosIncrementoFija = false;
      }
    });
  }

  guardarValorUVT(){
    if(this.formaValoresUVT.valid){
      Swal.fire({
        icon: 'info',
        title: 'Espere...',
        text: 'Validando Informacion!',
        allowOutsideClick: false
      });
      Swal.showLoading();
      const user = localStorage.getItem('usuario').toString();
      this.valoruvt.vlr_UVT_ACT = this.formaValoresUVT.value.valorUvt;
      this.valoruvt.anio_VIGENCIA = this.formaValoresUVT.value.annioVigencia;
      this.valoruvt.fec_INI_VIGENCIA = this.formaValoresUVT.value.fechaInicio;
      this.valoruvt.fec_FIN_VIGENCIA = this.formaValoresUVT.value.fechaFin;
      this.valoruvt.user_CREA = user;
      this.calculoSrv.guardarUvt(this.valoruvt,user).subscribe(resp=>{
        Swal.fire({
          icon:'info',
          title:'OK',
          text:resp
        });
        this.formaValoresUVT.reset();
        this.cargarListas();
        this.modal.dismissAll();
      },err=>{
        Swal.fire({
          icon:'error',
          title:'Upss..',
          text:'Se ha producido un error por favor intente mas tarde'
        });
      });

    }else{
      alert('faltan campos por llenar');
    }
    
  }

  borrarValorUvt(uvt:Uvts){   
    Swal.fire({
      title:'Desea eliminar este Registro?',
      confirmButtonColor:'#DC3545',
      showCancelButton:true,
      confirmButtonText:'Eliminar'
    }).then(resp=>{
      if(resp.isConfirmed){
        Swal.fire({
          icon: 'info',
          title: 'Espere...',
          text: 'Validando Informacion!',
          allowOutsideClick: false
        });
        Swal.showLoading();
        this.calculoSrv.borrarValorUvt(uvt).subscribe(resp=>{                    
          Swal.fire({
              icon:'info',
              title:'OK',
              text:resp
          });
          this.cargarListas();
        },err=>{
          Swal.fire({
            icon:'error',
            title:'Upss..',
            text:'Se ha producido un error por favor intente mas tarde'
          });
          this.cargarListas();
        });
      }
    });
  }

  abrirModalValoresUvt(contenido3){
    this.cargarFormularios();
    this.modal.open(contenido3,{size:'sm', centered:true, scrollable:true})
  }


  aceptarValoresUvt(acc){
    Swal.fire({
      title:'Desea aceptar la parametrizacion actual los Valores UVT?',
      confirmButtonColor:'#53A1D1',
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then(resp=>{
      if(resp.isConfirmed){
        this.parametrizacionValoresUvt = true;
        acc.collapseAll();
        acc.toggle('toggle-4');
      }
    });
  }

  cancelarValoresUvt(){
    Swal.fire({
      title:'Desea cancelar la parametrizacion actual?',
      confirmButtonColor:'#53A1D1',
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then(resp=>{
      if(resp.isConfirmed){
        this.parametrizacionValoresUvt = false;
      }
    });
  }

  guardarPSO(acc){
    const user = localStorage.getItem('usuario').toString();    
    if(this.opcionPSO!=='0'){

      if(this.opcionPSO==='1'){
        Swal.fire({
          icon: 'info',
          title: 'Espere...',
          text: 'Validando Informacion!',
          allowOutsideClick: false
        });
        Swal.showLoading();
        this.calculoSrv.ActualizacionPSO(user).subscribe(resp=>{
           Swal.fire({
             icon:'info',
             title:'OK',
             text:resp
           });
           this.cargarListas(); 
           this.opcionPSO = '0';
           this.parametrizacionActualizacionPSO = true;
           acc.collapseAll();
           

        },err=>{
          Swal.fire({
            icon:'error',
            title:'Upss!!!',
            text:'Se ha producido un error intente nuevamente!!'
          });
          this.cargarListas();
        });
      }else{
        this.cargarListas(); 
        this.opcionPSO = '0';
        this.parametrizacionActualizacionPSO = true;
        acc.collapseAll();
      }      
    }else{
      Swal.fire({
        icon:'error',
        title:'Seleccione una Opcion',
        text:'no selecciono ninguna opcion, por favor verifique e intente de nuevo'
      })
    }
  }

  cancelarActualizacionPSO(acc){
    Swal.fire({
      title:'Desea cancelar la parametrizacion actual',
      confirmButtonColor:'#53A1D1',
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then(resp=>{
      if(resp.isConfirmed){
        this.cargarListas();
        this.opcionPSO='0';
        this.parametrizacionActualizacionPSO = false;
      }
    })

  }

}