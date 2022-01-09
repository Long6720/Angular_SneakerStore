import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price'
})
export class PricePipePipe implements PipeTransform {

  transform(value: number) {
   return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  }

}
