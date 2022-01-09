import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AsideListComponent } from './aside-list/aside-list.component';
import { CartComponent } from './cart/cart.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SortPipe } from 'src/app/pipes/sort.pipe';
import { CheckoutComponent } from './checkout/checkout.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { PricePipe } from 'src/app/main-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    ProductRoutingModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    FormsModule,
    PricePipe
  ],
  declarations: [
    ProductComponent, 
    ProductListComponent, 
    ProductDetailComponent, 
    AsideListComponent,
    SortPipe,
    CartComponent,
    CheckoutComponent,
    ThankyouComponent
  ],
  providers: []
})
export class ProductModule { }

