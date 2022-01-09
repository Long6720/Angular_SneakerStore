import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModelServer, serverResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterContentInit {
  
  productOT: ProductModelServer[] = [];

  popular: any;

  popularList: ProductModelServer[]=[];

  productList: ProductModelServer[]=[];

  productSpecials: ProductModelServer[] = [];
  
  constructor(private readonly productService: ProductService,
              private readonly router: Router,
              private readonly route: ActivatedRoute,
              private readonly cartService: CartService) {}

  ngOnInit(){
    //Lấy sản phẩm theo loại sản phẩm
    this.productService.getProductsTypes().subscribe((prods: serverResponse ) => {
      this.productOT = prods.products;
    });
    
    this.popular = this.route.snapshot.paramMap.get('tensppb');
    this.productService.getProductsFromPopular(this.popular).subscribe((prods: serverResponse) => {
      this.popularList = prods.products;
    });
  }
  ngAfterContentInit(): void  {
    this.getProductAfter();
  }

  getProductAfter(){
    this.productService.getProductsPopular().subscribe((prods :serverResponse) => {
      this.popular = prods.products;
    });

    this.productService.getAllProducts().subscribe((prods: serverResponse ) => {
      this.productList = prods.products;
    });

    this.productService.getProductsFromSpecial().subscribe((prods: serverResponse) => {
      this.productSpecials = prods.products;
    });
  }

  selectProduct(masp: number) {
    this.router.navigate(['/product', masp]).then();
  }

  AddProduct(masp: number) {
    this.cartService.AddProductToCart(masp);
  }

  selectProductPopular(tensppb: String) {
    this.router.navigateByUrl('', {skipLocationChange:true}).then(()=>{
      this.router.navigate(['/', tensppb]);
    })
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }
}
