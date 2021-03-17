import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Biz } from '../../interfaces/biz';
import { BizService } from '../../services/biz.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-biz',
  templateUrl: './biz.component.html',
  styleUrls: ['./biz.component.css']
})
export class BizComponent implements OnInit {
  bizMessage:Biz={};
  forma: FormGroup;
  today: Date
  respSetBizInteraction:string='';
  panelResult:boolean=false;
  panelPeticion:boolean = true;
  constructor(private fb:FormBuilder,
              private bizservice:BizService) {
               
    this.crearFormulario();
    this.panelResult = false;
    this.panelPeticion = true; 
    this.today = new Date();
    // console.log(this.today.toISOString());
     
     
  }

  ngOnInit(): void {
  }
  // form = new FormGroup({
  //   first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),
  //   last: new FormControl('Drew', Validators.required)
  // });

  crearFormulario(){
    this.forma = this.fb.group({
      description: [{ value: '', disabled: false },Validators.required],
      service: [{ value: '21', disabled: false },Validators.required],
      categoryCode: [{ value: '1', disabled: false },Validators.required],
      subCategoryCode: [{ value: '6', disabled: false },Validators.required],
      voiceOfCustomerCode: [{ value: '577', disabled: false },Validators.required],
      closeInteractionCode: [{ value: '1549', disabled: false },Validators.required],
      domainName:[{ value: 'INSPIRA', disabled: true }],
      userSignum:[{ value: localStorage.getItem('usuario').toString() , disabled: true }],
      subject:[{ value: 'Incremento masivo de tarifas', disabled: true }],
      interactionDirectionTypeCode:[{ value: '0', disabled: true }]     
    });
  }


  cargarFormulario(){    
    this.forma.reset({
      description: '',
      service:  '21',
      categoryCode: '1',
      subCategoryCode: '6',
      voiceOfCustomerCode: '577',
      closeInteractionCode: '1549',
      domainName:'RR',
      userSignum: localStorage.getItem('usuario').toString(),
      subject:'Incremento masivo de tarifas',
      interactionDirectionTypeCode:'0'      
    });
  }

 
  
  get subjectNoValido(){
    return this.forma.get('subject').invalid && this.forma.get('subject').touched;
  }

  get descriptionNoValido(){
    return this.forma.get('description').invalid && this.forma.get('description').touched;
  }

  get serviceNoValido(){
    return this.forma.get('service').invalid && this.forma.get('service').touched;
  }

  get categoryCodeNoValido(){
    return this.forma.get('categoryCode').invalid && this.forma.get('categoryCode').touched;
  }
  get subCategoryCodeNoValido(){
    return this.forma.get('subCategoryCode').invalid && this.forma.get('subCategoryCode').touched;
  }

  get voiceOfCustomerCodeNoValido(){
    return this.forma.get('voiceOfCustomerCode').invalid && this.forma.get('voiceOfCustomerCode').touched;
  }
  get closeInteractionCodeNoValido(){
    return this.forma.get('closeInteractionCode').invalid && this.forma.get('closeInteractionCode').touched;
  }

  guardar(){

    if(this.forma.invalid){
      Object.values(this.forma.controls).forEach(control=>{
        return control.markAsTouched();
      });     
    }else{
      Swal.fire({
          didOpen:()=>{
            Swal.showLoading()
          } ,
          title: 'Espere...',
          text: 'Validando Informacion!',
          allowOutsideClick: false ,
          showConfirmButton: false,
          allowEscapeKey:false
        });
      this.bizMessage.description = this.forma.get('description').value; 
      this.bizMessage.service = this.forma.get('service').value;
      this.bizMessage.categoryCode = this.forma.get('categoryCode').value;
      this.bizMessage.subCategoryCode = this.forma.get('subCategoryCode').value;
      this.bizMessage.voiceOfCustomerCode = this.forma.get('voiceOfCustomerCode').value;
      this.bizMessage.closeInteractionCode = this.forma.get('closeInteractionCode').value;
      this.bizMessage.domainName = this.forma.get('domainName').value;
      this.bizMessage.userSignum = localStorage.getItem('usuario');
      this.bizMessage.executionDate = this.today.toISOString().toString();
      this.bizMessage.subject = this.forma.get('subject').value;
      this.bizMessage.interactionDirectionTypeCode = this.forma.get('interactionDirectionTypeCode').value;
      // this.bizMessage.customerCode = this.forma.get('customerCode').value;
            
      this.bizservice.getBiz(this.bizMessage).subscribe((resp:any) =>{
        console.log(resp);
        if(resp.isValid){
            Swal.fire({
              icon: 'success',
              title: 'OK',
              text: 'Guardado Correctamente',
              allowOutsideClick: false
            });
            this.respSetBizInteraction = resp;
            this.panelResult = true;
            this.panelPeticion = false;
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Upsss..',
            text: 'Algo salio mal.. verifica datos y envia de nuevo',
            allowOutsideClick: false
          });
        }    
      },err =>{
        Swal.fire({
          icon: 'error',
          title: 'Upsss..',
          text: 'Algo salio mal.. Error en la conexion',
          allowOutsideClick: false
        });
      });
      this.cargarFormulario();
    }    
  }

  regresar(){
    this.respSetBizInteraction = '';
    this.panelResult = false;
    this.panelPeticion = true; 
  }




  

}
