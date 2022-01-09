import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import { PricePipePipe } from './pipes/price-pipe.pipe';


@NgModule({
  declarations:[PricePipePipe], 
  imports:[CommonModule],
  exports:[PricePipePipe] 
})

export class PricePipe{}