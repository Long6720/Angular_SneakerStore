export interface OrderResponse {
    mahd: number;
    success: boolean;
    products: [{
      id: string,
      numInCart: string
    }];
}

export interface ProductResponseModel {
  masp: number;
  hinhsp: string;
  tensp: string;
  dongia: number;
  soluongdat: number;
}

