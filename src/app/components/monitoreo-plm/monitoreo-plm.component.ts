import { JsonPipe } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { MonitoreoService } from '../../services/monitoreo.service';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-monitoreo-plm',
  templateUrl: './monitoreo-plm.component.html',
  styleUrls: ['./monitoreo-plm.component.css'],
  providers:[JsonPipe],  
})
export class MonitoreoPlmComponent implements OnInit {
  fallos:number=0;
  nombreArchivo:string = 'No Encontrado';
  estadoArchivo:string = 'No Encontrado';
  textoboton:string = 'Ver mas...'
  inputBatchId:string;
  completados:string;
  pendientes:string;
  fallidos:string;
  total:string;
  attribs:string;
  executionDetails:string;
  cadena:string;
  executionDetailsArray:any[]=[];
  executionFilter:any[]=[];
  lista:{}
  carga:boolean=false;
  muestraArchivoPlano:boolean;
  muestraBatchId:boolean;
  muestraSelect:boolean;
  buttonMonitoreo:boolean;
  areajson:boolean = false;
  muestratablaResultados:boolean=false;
  muestratablaDetallesErrores:boolean=false;
  
  sidebar: any

  constructor(private monitoreoService: MonitoreoService,
              private jsonpipe:JsonPipe) { 

    this.muestraArchivoPlano=false;
    this.muestraBatchId=false;
    this.muestraSelect=true;
    this.buttonMonitoreo=false; 
    this.areajson=false; 
    this.muestratablaResultados = false;
    this.muestratablaDetallesErrores=false;

    this.sidebar = document.querySelector('#sidebar-container');         
    this.sidebar.classList.add('height-nav')
  }

     ngOnInit() {
   }

//   uploadFile(event: Event) {
//     const element = event.currentTarget as HTMLInputElement;
//     let fileList: FileList | null = element.files;
//     if (fileList) {
//       console.log("FileUpload -> files", fileList[0].name);
//       fileList.item.name;
//     }
// }

validarNombre(event:Event){
  const element = event.currentTarget as HTMLInputElement;
  let files: FileList | null = element.files;
  let nombreArchivo2 = files[0].name.split('.',2);
  this.nombreArchivo = nombreArchivo2[0];
  this.estadoArchivo = 'Completo'; 
  this.areajson = false;
  this.muestratablaResultados = false;
  this.muestratablaDetallesErrores = false;
}

monitorear(){
  this.sidebar.classList.remove('height-nav')
  this.attribs = '';
  this.executionFilter = [];
  this.muestratablaResultados = false;
  this.muestratablaDetallesErrores = false;
  this.buttonMonitoreo=true;
  if(this.nombreArchivo === 'No Encontrado'){
      alert('No se ha seleccionado ningun archivo');
      this.buttonMonitoreo = false;
  }else{
    this.carga = true;
    this.buttonMonitoreo=true;
    const resp = this.monitoreoService.getInformacionMonitoreo(this.nombreArchivo)
                  .subscribe( (data:any) => {                    
                    let obj:Object=[];
                    obj = data;         
                    this.areajson = true; 
                    this.buttonMonitoreo = false;
                    if(obj.hasOwnProperty('attribs')){
                      this.completados = data.attribs.executionSummary.completedCount;
                      this.pendientes = data.attribs.executionSummary.pendingCount;
                      this.fallidos = data.attribs.executionSummary.failedCount;
                      this.total = data.attribs.executionSummary.totalCount; 
                      this.fallos = Number.parseInt(this.fallidos) - 1;
                      this.muestratablaResultados = true;  
                      this.attribs = this.jsonpipe.transform(data.attribs);
                      if(this.fallos>0){                                                    
                        if(data.attribs.executionDetails){
                          this.executionDetailsArray = data.attribs.executionDetails;                           
                          for (let item of this.executionDetailsArray) {
                            if(item.orderType === 'MassiveTariffsPrices'){
                              console.log(item.items[1].attribs.customerId);
                              this.executionFilter.push(item)
                              console.log(this.executionFilter);
                              
                            }
                          }
                        }else{
                          console.log('no tiene la propiedad executionDetails');                            
                        }
                      }else{
                        this.attribs = this.jsonpipe.transform(data.attribs);
                        this.muestratablaResultados = true;
                      }
                      this.carga = false;                      
                    }else{                     
                      this.carga = false;
                      this.attribs = this.jsonpipe.transform(data)                 
                      
                    }                  
                  },err  =>{
                    this.areajson = true; 
                    this.buttonMonitoreo = false;
                    this.carga = false;                    
                    console.log(err);
                    this.attribs = this.jsonpipe.transform(err);
                  });   
  }
}

monitorearBatchId(inputBatchId:any){
  this.attribs = '';
  this.executionFilter = [];
  this.muestratablaResultados = false;
  this.muestratablaDetallesErrores = false;
  this.buttonMonitoreo=true;
  if(inputBatchId === ''){
      alert('No se Ingreso ningun Batch ID');
      this.buttonMonitoreo = false;
  }else{
    this.carga = true;
    const resp = this.monitoreoService.getInformacionMonitoreo(inputBatchId)
                  .subscribe( (data:any) => {
                    this.areajson = true;                  
                    this.buttonMonitoreo = false;
                    let obj:Object=[];
                    obj = data;                   
                    if(obj.hasOwnProperty('attribs')){  
                      this.completados = data.attribs.executionSummary.completedCount;
                      this.pendientes = data.attribs.executionSummary.pendingCount;                    
                      this.total = data.attribs.executionSummary.totalCount;   
                      this.muestratablaResultados = true;                 
                      this.attribs = this.jsonpipe.transform(data.attribs);
                      this.fallidos = data.attribs.executionSummary.failedCount;
                      this.fallos = Number.parseInt(this.fallidos) - 1;
                      if(this.fallos>0){                                                    
                          if(data.attribs.executionDetails){
                            this.executionDetailsArray = data.attribs.executionDetails;                           
                            for (let item of this.executionDetailsArray) {
                              if(item.orderType === 'MassiveTariffsPrices'){
                                console.log(item.items[1].attribs.customerId);
                                this.executionFilter.push(item)
                                console.log(this.executionFilter);
                                
                              }
                            }
                          }else{
                            console.log('no tiene la propiedad executionDetails');                            
                          }
                      }else{
                        this.attribs = this.jsonpipe.transform(data.attribs);
                        this.muestratablaResultados = true;
                      }
                      this.carga = false;                                                               
                    }else{                     
                      this.carga = false;
                      this.attribs = this.jsonpipe.transform(data);                
                      
                    }                  
                  },err  =>{
                    this.muestratablaResultados = false;
                    this.muestratablaDetallesErrores = false;
                    this.areajson = true; 
                    this.carga = false;
                    this.buttonMonitoreo = false;                    
                    console.log(err);
                    this.attribs = this.jsonpipe.transform(err);
                  });   
  }  
  
}

cambiarTextoBoton(){
  if(this.muestratablaDetallesErrores){
    this.textoboton = 'Ver menos...'
  }else{
    this.textoboton = 'Ver mas...'
  }
}

irAtrasArchivoPlano(){
  this.muestraSelect=true; 
  this.muestraArchivoPlano=false; 
  this.attribs=''; 
  this.areajson=false;
  this.muestratablaDetallesErrores = false;
  this.muestratablaResultados= false;
}

irAtrasBatchId(){
  this.muestraSelect=true; 
  this.muestraBatchId=false; 
  this.attribs=''; 
  this.areajson=false;
  this.muestratablaDetallesErrores = false;
  this.muestratablaResultados = false;
}



captura(select:any){
 if(select==='1'){
   this.muestraSelect=false;
   this.muestraArchivoPlano=true;
 }else if(select==='2'){
   this.muestraSelect=false;
   this.muestraBatchId=true;
 }
 
}
  

}

