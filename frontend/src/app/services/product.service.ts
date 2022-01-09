import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProductModelServer, serverResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url = environment.SERVER_URL;
  constructor(private http: HttpClient) { };

  // Lấy tất cả sản phẩm
  getAllProducts(limitOfResults = 8): Observable<serverResponse> {
    return this.http.get<serverResponse>(this.url + 'products', {
      params: {
        limit: limitOfResults.toString()
      }
    }).pipe();
  }

  //lấy 1 sản phẩm từ id sản phẩm
  getSingleProduct(masp: number): Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(this.url + 'products/' + masp).pipe(map((res:any) => {return res}));
  }

  // lấy tất cả sản phẩm ở trang sản phẩm
  getProductsTypes(): Observable<serverResponse> {
    return this.http.get<serverResponse>(this.url + 'productOfType').pipe(map((res:any) => {return res}));
  }

  //lấy sản phẩm theo Mã loại sản phẩm
  getProductsFromType(tenlsp: string): Observable<serverResponse> {
    return this.http.get<serverResponse>(this.url + 'products/loaisp/' + tenlsp)
    .pipe(
      map((res:any) => {
        return res}
        ));
  }

  getProductsFromPopular(tensppb: string, results = 8): Observable<serverResponse> {
    return this.http.get<serverResponse>(this.url + 'products/phobien/' + tensppb, {params: {limit: results.toString()}}).pipe(map((res:any) => {return res}));
  }

  // lấy tất cả sản phẩm ở phổ biến
  getProductsPopular(): Observable<serverResponse> {
    return this.http.get<serverResponse>(this.url + 'popular').pipe(map((res:any) => {return res}));
  }
  
  // lấy sản phẩm đặc biệt
  getProductsFromSpecial(results = 4): Observable<serverResponse> {
    return this.http.get<serverResponse>(this.url + 'products/phobien/Đặc biệt', {params: {limit: results.toString()}}).pipe(map((res:any) => {return res}));
  }

  // Lấy tất cả sản phẩm
  getAllAdminProducts(): Observable<serverResponse> {
    return this.http.get<serverResponse>(this.url + 'products').pipe();
  }

  // Xóa 1 sản phẩm
  deleteProduct(masp: number): Observable<serverResponse> {
    return this.http.delete<serverResponse>(this.url + 'products/delete/' + masp)
      .pipe(
        switchMap(async(data) => {
          const prods = await this.getAllAdminProducts().toPromise();
          return {
            ...data,
            ...prods
          };
        })
      );
  }
}
