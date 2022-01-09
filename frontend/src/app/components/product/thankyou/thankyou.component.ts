import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductResponseModel } from 'src/app/models/order.model';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {
  mahd!: number;
  products: ProductResponseModel[]=[];
  cartTotal!: number;

  constructor(private readonly router: Router) {
    
    const navigation = this.router.getCurrentNavigation();

    console.log(navigation?.extras.state);
    
    const state = navigation?.extras.state as {
      mahd: number,
      products: ProductResponseModel[],
      total: number
    };
    this.mahd = state.mahd;
    this.products = state.products;
    console.log(this.products);
    this.cartTotal = state.total;
  }

  ngOnInit(): void {
  }

}
