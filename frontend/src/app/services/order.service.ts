import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductResponseModel } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  private url = environment.SERVER_URL;

  constructor(private readonly http: HttpClient) {}

  getSingleOrder(mahd: number) {
    return this.http.get<ProductResponseModel[]>(this.url + 'orders/' + mahd).toPromise();
  }
  
}
