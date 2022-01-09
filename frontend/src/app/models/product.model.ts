
export interface ProductModelServer {
    masp: number;
    tensp: string;
    dongiamoi: number;
    dongiacu: number;
    giamgia?: number;
    soluong: number;
    hinhsp: string;
    hinhsp2?: string;
    hinhsp3?: string;
    hinhsp4?: string;
    hinhlsp?: string;
    malsp: number;
    mapb: number;
    tensppb: string;
    tenlsp: string;
  }
  
  export interface serverResponse  {
    count: number;
    products: ProductModelServer[];
  };

  