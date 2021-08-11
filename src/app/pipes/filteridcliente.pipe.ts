import { Pipe, PipeTransform } from '@angular/core';
import { CalculoIncremento } from '../classes/calculo-incremento';

@Pipe({
  name: 'filteridcliente'
})
export class FilteridclientePipe implements PipeTransform {

  transform(value: CalculoIncremento[], idCliente: string, noRef:string, idenClie:string ): any {
    const result = [];
    
    if(idCliente.length===0 && noRef.length===0 && idenClie.length===0 ){
      for (const calculo of value) {
        result.push(calculo)
      }
    }else{
      if(idCliente.length>0){
        for (const calculo of value) {                 
          if(calculo.id_CLIENTE.toString().indexOf(idCliente) > -1){
            result.push(calculo);
          };
        };
      }
      if(noRef.length>0){
        for (const calculo of value) {                 
          if(calculo.no_REFERENCIA.toString().indexOf(noRef) > -1){
            result.push(calculo);
          };
        };
  
      }
      if(idenClie.length>0){
        for (const calculo of value) {                 
          if(calculo.iden_CLIE.toString().indexOf(idenClie) > -1){
            result.push(calculo);
          };
        };
      } 
    }

    

    
    return result;
  }

}
