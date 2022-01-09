import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { MainComponent } from './main/main.component';
import { PricePipe } from 'src/app/main-pipe.module';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AdminComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    PricePipe,
    NgxPaginationModule
  ],
})
export class AdminModule { }
