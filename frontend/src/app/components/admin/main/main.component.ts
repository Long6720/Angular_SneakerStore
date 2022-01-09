import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductModelServer, serverResponse } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'admin-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  products: ProductModelServer[] = [];
  subs: Subscription[] = [];
  p: number = 1;
  config = {
    id: 'custom',
    itemsPerPage: 8,
    currentPage: 1
  };
  constructor(private readonly productService: ProductService) { }

  ngOnInit(): void {
    this.subs.push(this.productService.getAllAdminProducts().subscribe((prods: serverResponse) => {
      this.products = prods.products;
    }));
  }

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }

  deleteProduct(id: number): void {
    this.subs.push(this.productService.deleteProduct(id).subscribe(
      res => {
        this.products = res.products;
        console.log(this.products);
      }
    ));
  }
}
