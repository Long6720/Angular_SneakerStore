import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

import {environment} from "../../environments/environment";
import {NavigationExtras, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";

import { ProductModelServer } from '../models/product.model';
import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';
import { OrderService } from './order.service';
import { CartItems, CartServer } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  private url = environment.SERVER_URL;
  private cartDataClient: CartItems = {prodData: [{incart: 0, id: 0}], total: 0,
  };

  private cartDataServer: CartServer = {
    data: [{
      product: undefined!,
      numInCart: 0
    }],
    total: 0, 
  };
  
  cartTotal$ = new BehaviorSubject<number>(0);
  cartItems$ = new BehaviorSubject<CartServer>(this.cartDataServer);
  
  constructor(private  productService: ProductService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private http: HttpClient,
              private orderService: OrderService,
              private router: Router) {
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartItems$.next(this.cartDataServer);
    const info: CartItems = this.getCartData();
    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      this.cartDataClient = info;
      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProdInfo: ProductModelServer) => {
          if (this.cartDataServer.data[0].numInCart === 0) {
            this.cartDataServer.data[0].numInCart = p.incart;
            this.cartDataServer.data[0].product = actualProdInfo;
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            this.setCartData(this.cartDataClient);
          } 
          else {
            this.cartDataServer.data.push({
              numInCart: p.incart,
              product: actualProdInfo
            });
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            this.setCartData(this.cartDataClient);
          }
          this.cartItems$.next({...this.cartDataServer});
        });
      });
    }
  }

  CalculateSubTotal(index:any): number {
    let subTotal = 0;
    let p = this.cartDataServer.data[index];
    subTotal = p.product.dongiamoi * p.numInCart;
    return subTotal;
  }
  // GetSize(index: any): number {
  //   let size = 0;
  //   let s = this.cartDataServer.data[index];
  //   size = s.size;
  //   return size;
  // }
  // Lấy size giày
  // AddSize(size: number) {
  //   this.productService.getSingleSize(size).pipe(last()).subscribe((sizeId: SizeModel) => {
  //     this.cartDataServer.data[0].size = sizeId.kichthuoc;
  //     this.cartItems$.next(this.cartDataServer);
  //   });
  // }
  AddProductToCart(masp: number, soluong?: number) {
    this.productService.getSingleProduct(masp).subscribe(prod => {
      // nếu giỏ hàng trống
      if(this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = soluong !== undefined ? soluong : 1;
        this.CalculateTotal();
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.masp;
        this.cartDataClient.total = this.cartDataServer.total;
        this.setCartData(this.cartDataClient);
        this.cartItems$.next({...this.cartDataServer});
        this.toastr.success(`${prod.tensp} đã thêm vào giỏ hàng.`, "Sản phẩm đã được thêm", {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }
      else {
        const index = this.cartDataServer.data.findIndex(p => p.product.masp === prod.masp);
        if(index !== -1) {
          if(soluong !== undefined && soluong <= prod.soluong) {
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.soluong ? soluong : prod.soluong
          } else {
            this.cartDataServer.data[index].numInCart < prod.soluong ? this.cartDataServer.data[index].numInCart++ : prod.soluong;
          }
          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
          this.CalculateTotal();
          this.cartDataClient.total = this.cartDataServer.total;
          this.setCartData(this.cartDataClient);
          this.toastr.info(`${prod.tensp} số lượng đã được cập nhật.`,"Sản phẩm đã được cập nhật", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
        else {
          this.cartDataServer.data.push({
            product: prod,
            numInCart: 1
          });
          this.cartDataClient.prodData.push({
            incart: 1,
            id: prod.masp
          });
          this.toastr.success(`${prod.tensp} đã thêm vào giỏ hàng.`, "Sản phẩm đã được thêm", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })
        }
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        this.setCartData(this.cartDataClient);
        this.cartItems$.next({...this.cartDataServer});
      }
    });
  }
  UpdateCartData( index: any, increase: Boolean) {
    let data = this.cartDataServer.data[index];
    if(increase){
      data.numInCart < data.product.soluong ? data.numInCart++ : data.product.soluong;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      this.setCartData(this.cartDataClient);
      this.cartItems$.next({...this.cartDataServer});
    } else {
      data.numInCart--;
      if(data.numInCart < 1) {
        this.DeleteProductFromCart(index);
        this.cartItems$.next({...this.cartDataServer});
      } else {
        this.cartItems$.next({...this.cartDataServer});
        this.cartDataClient.prodData[index].incart = data.numInCart;
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        this.setCartData(this.cartDataClient);
      }
    }
  }
  DeleteProductFromCart(index: any) {
    if(window.confirm(`Bạn có muốn xóa sản phẩm này không?`)) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index,1);
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      if(this.cartDataClient.total === 0){
        this.cartDataClient = {prodData: [{incart: 0, id: 0}], total: 0};
        this.setCartData(this.cartDataClient);
      } else {
        this.setCartData(this.cartDataClient);
      }
      if(this.cartDataServer.total === 0){
        this.cartDataServer = {
          data: [{
            product: undefined!,
            numInCart: 0
          }],
          total: 0
        };
        this.cartItems$.next({...this.cartDataServer});
      } else {
        this.cartItems$.next({...this.cartDataServer});
      }
    }
    else { return; }
  }
  // Thanh toán
  CheckoutFromCart(mand: number) {
    this.http.post(`${this.url}orders/payment`, null)
    .subscribe((res: {success?: boolean}) => {
      if (res.success) {
        this.http.post(`${this.url}orders/new`, {
          mand: mand,
          products: this.cartDataClient.prodData
        })
        .subscribe((data: any ) => {
          this.orderService.getSingleOrder(data.mahd).then(prods => {
            if (data.success) {
              const navigationExtras: NavigationExtras = {
                state: {
                  mahd: data.mahd,
                  products: prods,
                  total: this.cartDataClient.total
                }
              };
              this.spinner.hide().then();
              this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                this.cartDataClient = {total: 0, prodData: [{incart: 0, id: 0}]};
                this.cartTotal$.next(0);
                this.setCartData(this.cartDataClient);
              });
            }
          });
        })
      } else {
        this.spinner.hide().then();
        this.router.navigateByUrl('/checkout').then();
        this.toastr.error(`Xin lỗi, Đặt hàng thất bại`, "Tình trạng đặt hàng", {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    });
  }

  private CalculateTotal() {
    let total = 0;
    this.cartDataServer.data.forEach(p => {
      const {numInCart} = p;
      const {dongiamoi} = p.product;

      total += numInCart * dongiamoi;
    });
    this.cartDataServer.total = total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  setCartData(data: any) {
    localStorage.setItem('cart', JSON.stringify(data));
  }

  getCartData() {
    return JSON.parse(localStorage.getItem('cart') as string);
  }

  private resetServerData() {
    this.cartDataServer = {
      data: [{
        product: undefined!,
        numInCart: 0,
      }],
      total: 0
    };
    this.cartItems$.next({...this.cartDataServer});
  }
}






