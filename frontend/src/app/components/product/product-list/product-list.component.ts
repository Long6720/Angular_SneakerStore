
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductModelServer, serverResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  productsList: ProductModelServer[]=[];
  tenlsp:any;
  totalLength:any;
  SortbyParam='';

  p: number = 1;
  config = {
    id: 'custom',
    itemsPerPage: 8,
    currentPage: 1
  };
  constructor(private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly cartService: CartService) { }

  
  ngOnInit(): void {
    this.tenlsp = this.route.snapshot.paramMap.get('tenlsp');
    
    this.productService.getProductsFromType(this.tenlsp).subscribe((prods: serverResponse ) => {
      this.productsList = prods.products;
    });
  }
  selectProduct(masp: number) {
    this.router.navigate(['/product', masp]).then();
  }
  AddProduct(masp: number) {
    this.cartService.AddProductToCart(masp);
  }

}
