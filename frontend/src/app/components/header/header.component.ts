
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { CartServer } from 'src/app/models/cart.model';
import { ProductModelServer, serverResponse } from 'src/app/models/product.model';
import { UserResponse } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  productOT: ProductModelServer[] = [];

  cartData!: CartServer;
  cartTotal!: number;
  userData: any;

  constructor(private readonly productService: ProductService,
              private readonly router: Router,
              public cartService: CartService,
              public auth: AuthService) { }

  ngOnInit(){
    this.cartService.cartTotal$.subscribe(total => {
      this.cartTotal = total;
    });

    this.cartService.cartItems$.subscribe(data => {
      this.cartData = data;
    });

    this.getUserData();
    
    //Lấy sản phẩm theo loại sản phẩm
    this.productService.getProductsTypes().subscribe((prods: serverResponse ) => {
      this.productOT = prods.products;
    });
  }

  getUserData(){
    this.auth.userData$.pipe(
      map((user: UserResponse) => {
        return user;
      })
    ).subscribe((data: UserResponse) => {
      this.userData = data;
    });
  }
    // this.auth.currentUser.subscribe(data => {
    //   this.userService.getSingleUser(data.mand).subscribe(user => this.userData = user);
    //   this.userData = data;
    // this.userService.getSingleUser(user.email)--
    // });
    // this.route.params.subscribe(params => {
    //   const tennd = params['tennd'];
    //   this.userService.getSingleUser(tennd).subscribe(user => this.userData = user);
    //   console.log(this.userData);
    // })
    
  
  //router tới 1 loại sản phẩm 
  selectProductOfType(tenlsp: String) {
    this.router.navigateByUrl('', {skipLocationChange:true}).then(()=>{
      this.router.navigate(['/product/loaisp/', tenlsp]);
    })
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }
}
