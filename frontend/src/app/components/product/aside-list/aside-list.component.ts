
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductModelServer, serverResponse } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-aside-list',
  templateUrl: './aside-list.component.html',
  styleUrls: ['./aside-list.component.css']
})
export class AsideListComponent implements OnInit {

  productOT: ProductModelServer[] = [];

  constructor(private productService: ProductService,
    private router: Router) { }

  ngOnInit(){
    //Lấy sản phẩm theo loại sản phẩm
    this.productService.getProductsTypes().subscribe((prods: serverResponse ) => {
      this.productOT = prods.products;
    });
  }
  selectProductOfType(tenlsp: String) {
    this.router.navigateByUrl('', {skipLocationChange:true}).then(()=>{
      this.router.navigate(['/product/loaisp/', tenlsp]);
    })
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }
}