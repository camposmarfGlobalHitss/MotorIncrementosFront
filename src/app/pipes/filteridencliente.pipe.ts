import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filteridencliente'
})
export class FilteridenclientePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
