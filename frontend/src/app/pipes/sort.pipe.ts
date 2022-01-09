import {Pipe, PipeTransform} from '@angular/core';
import { ProductModelServer } from '../models/product.model';


@Pipe({
  name: 'sort',
  pure: true
})
export class SortPipe implements PipeTransform {

  transform(products: ProductModelServer[], sort: string): ProductModelServer[] {
    if (sort === 'asc' || sort === 'desc') {
      products.sort((a, b) => {
        const diff = a.dongiamoi - b.dongiamoi;
        if (diff === 0) {
          return 0;
        }
        const sign = Math.abs(diff) / diff;
        return sort === 'asc' ? sign : -sign;
      });
    }
    return products;
  }
}