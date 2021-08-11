import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterref'
})
export class FilterrefPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
