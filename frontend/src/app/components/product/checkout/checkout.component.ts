import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartTotal: any;
  cartData!: CartServer;
  mand: any;

  constructor(private cartService: CartService,
              private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
    console.log(this.cartData);
  }

  onCheckout() {
    this.spinner.show().then(p => {
      this.cartService.CheckoutFromCart(4);
    });
  }
}
