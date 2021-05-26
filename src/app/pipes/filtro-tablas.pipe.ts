import { Pipe, PipeTransform } from '@angular/core';
import { Auditoria } from '../classes/auditoria';

@Pipe({
  name: 'filtroTablas'
})
export class FiltroTablasPipe implements PipeTransform {

  transform(value: any, arg:string): any {
    const resultFilter = [];
    for(const audit of value){
        if(audit.nombreObjeto.toLowerCase().indexOf(arg.toLowerCase())>-1){
            resultFilter.push(audit);
        };
    };

    return resultFilter;
  }

}
