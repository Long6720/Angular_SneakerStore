import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, pluck, switchMap} from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: any;
  constructor(private readonly productService: ProductService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cartService: CartService) { }

  ngOnInit(): void {
    this.getDetailSingleProduct();
    // this.getSizeProduct();
  }

  getDetailSingleProduct(){
    this.product = this.route.params
    .pipe(
      pluck('masp'),
      switchMap(masp => this.productService.getSingleProduct(masp)),
      filter(product => !!product)
    ).subscribe(prod => this.product = prod);
  }

  // getSizeProduct(){
  //   this.productService.getAllSize().subscribe((size: SizeResponse) => {
  //     this.size = size.size;
  //   })
  // }

  // onSelectSize(size: number){
  //   this.cartService.AddSize(size);
  //   console.log(size);
  // }

  AddProduct(masp: number) {
    this.cartService.AddProductToCart(masp);
  }
  BuyNow(masp: number) {
    this.cartService.AddProductToCart(masp);
    this.router.navigate(['/cart']).then();
  }
}
