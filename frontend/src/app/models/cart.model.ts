import {ProductModelServer} from "./product.model";

export interface CartServer {
  data: [{
    product: ProductModelServer
    numInCart: number
  }];
  total: number;
}

export interface CartItems {
  total: number;
  prodData: [{
    id: number,
    incart: number
  }];
}




