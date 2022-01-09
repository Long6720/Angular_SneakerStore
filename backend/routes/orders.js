import express from "express";
import { database } from "../config/helpers.js";

const ordersRouter = express.Router();
// GET ALL ORDERS
ordersRouter.get("/", (req, res) => {
  database
    .table("ct_hoadon as ct")
    .join([
      {
        table: "hoadon as hd",
        on: "hd.mahd = ct.mahd",
      },
      {
        table: "sanpham as sp",
        on: "sp.masp = ct.masp",
      },
      {
        table: "nguoidung as nd",
        on: "nd.mand = hd.mand",
      },
    ])
    .withFields([
      `hd.mahd`,
      `sp.hinhsp`,
      `sp.tensp`,
      `ct.soluong`,
      `sp.dongiamoi`,
      `nd.tennd`,
    ])
    .getAll()
    .then((orders) => {
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.json({
          message: `No hoadon found`,
        });
      }
    })
    .catch((err) => console.log(err));
});

//GET SINGLE ORDERS
ordersRouter.get("/:mahd", async (req, res) => {
  let mahd = req.params.mahd;

  database
    .table("ct_hoadon as ct")
    .join([
      {
        table: "hoadon as hd",
        on: "hd.mahd = ct.mahd",
      },
      {
        table: "sanpham as sp",
        on: "sp.masp = ct.masp",
      },
      {
        table: "nguoidung as nd",
        on: "nd.mand = hd.mand",
      },
    ])
    .withFields([
      `hd.mahd`,
      `sp.hinhsp`,
      `sp.tensp`,
      `ct.soluong as soluongdat`,
      `sp.dongiamoi`,
      `ct.thanhtien`,
    ])
    .filter({ "hd.mahd": mahd })
    .get()
    .then((orders) => {
      if (orders > 0) {
        res.status(200).json(orders);
      } else {
        res.json({
          message: `No hoadon found with mã ${orderId}`,
        });
      }
    })
    .catch((err) => res.json(err));
});

// PLACE A NEW ORDER
ordersRouter.post("/new", async (req, res) => {
  let { mand, products } = req.body;
  if (mand != null && mand > 0) {
    database
      .table("hoadon")
      .insert({
        mand: mand,
      })
      .then((newOrderId) => {
        if (newOrderId > 0) {
          products.forEach(async (p) => {
            let data = await database
              .table("sanpham")
              .filter({ masp: p.masp })
              .withFields([
                "masp",
                "tensp",
                "hinhsp",
                "dongiamoi",
                "soluong",
                "thanhtien",
              ])
              .get();

            let inCart = parseInt(p.incart);

            if (data.soluong > 0) {
              data.soluong = data.soluong - inCart;
              if (data.soluong < 0) {
                data.soluong = 0;
              }
            } else {
              data.soluong = 0;
            }
            database
              .table("ct_hoadon")
              .insert({
                mahd: newOrderId,
                masp: p.masp,
                dongia: p.dongiamoi,
                soluong: inCart,
                thanhtien: p.dongia * inCart,
              })
              .then((newId) => {
                database
                  .table("sanpham")
                  .filter({ masp: p.masp })
                  .update({
                    soluong: data.soluong,
                  })
                  .then((successNum) => {})
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          });
        } else {
          res.json({
            message: "Tạo hóa đơn mới thất bại khi thêm chi tiết hóa đơn",
            success: false,
          });
        }
        res.json({
          message: `Đặt hàng thành công với mahd ${newOrderId}`,
          success: true,
          mahd: newOrderId,
          products: products,
        });
      })
      .catch((err) => res.json(err));
  } else {
    res.json({
      message: "Tạo hóa đơn mới thất bại",
      success: false,
    });
  }
});

// FAKE PAYMENT GATEWAY CALL
ordersRouter.post("/payment", (req, res) => {
  setTimeout(() => {
    res.status(200).json({ success: true });
  }, 1000);
});

export default ordersRouter;
