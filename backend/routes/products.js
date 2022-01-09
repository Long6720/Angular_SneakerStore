import express from "express";
import { database } from "../config/helpers.js";

const productsRouter = express.Router();

/* GET ALL PRODUCTS. */
productsRouter.get("/", async (req, res) => {
  let page =
    req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1;
  const limit =
    req.query.limit !== undefined && req.query.limit !== 0
      ? req.query.limit
      : 60; // set limit of items per page
  let startValue;
  let endValue;
  if (page > 0) {
    startValue = page * limit - limit; // 0, 10, 20, 30
    endValue = page * limit; // 10, 20, 30, 40
  } else {
    startValue = 0;
    endValue = 60;
  }
  database
    .table("sanpham as sp")
    .join([
      {
        table: "loaisp as lsp",
        on: `lsp.malsp = sp.malsp`,
      },
      {
        table: "phobien as pb",
        on: `pb.mapb = sp.mapb`,
      },
    ])
    .withFields([
      "lsp.tenlsp",
      "lsp.malsp",
      "lsp.hinhlsp",
      "sp.tensp",
      "sp.dongiamoi",
      "sp.dongiacu",
      "sp.giamgia",
      "sp.hinhsp",
      "sp.hinhsp2",
      "sp.hinhsp3",
      "sp.hinhsp4",
      "sp.soluong",
      "pb.mapb",
      "pb.tensppb",
      "sp.masp",
    ])
    .slice(startValue, endValue)
    .sort({ masp: 0.1 })
    .getAll()
    .then((prods) => {
      if (prods.length > 0) {
        res.status(200).json({
          count: prods.length, //đếm số lượng sản phẩm
          products: prods,
        });
      } else {
        res.json({ message: "No products founds" });
      }
    })
    .catch((err) => console.log(err));
});

/* GET SINGLE PRODUCTS. */
productsRouter.get("/:prodId", function (req, res) {
  let productId = req.params.prodId;

  database
    .table("sanpham as sp")
    .join([
      {
        table: "loaisp as lsp",
        on: `lsp.malsp = sp.malsp`,
      },
      {
        table: "phobien as pb",
        on: `pb.mapb = sp.mapb`,
      },
    ])
    .withFields([
      "lsp.tenlsp",
      "lsp.malsp",
      "lsp.hinhlsp",
      "sp.tensp",
      "sp.dongiamoi",
      "sp.dongiacu",
      "sp.giamgia",
      "sp.hinhsp",
      "sp.hinhsp2",
      "sp.hinhsp3",
      "sp.hinhsp4",
      "sp.soluong",
      "pb.mapb",
      "pb.tensppb",
      "sp.masp",
    ])
    .filter({
      "sp.masp": productId,
    })
    .get()
    .then((prod) => {
      if (prod) {
        res.status(200).json(prod);
      } else {
        res.json({
          message: `No products founds with product id ${prod}`,
        });
      }
    })
    .catch((err) => console.log(err));
});
// GET ALL PRODUCTS FROM ONE PARTICULAR LOAISP
productsRouter.get("/loaisp/:tenlsp", function (req, res) {
  let page =
    req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1;
  const limit =
    req.query.limit !== undefined && req.query.limit !== 0
      ? req.query.limit
      : 60; // set limit of items per page
  let startValue;
  let endValue;
  if (page > 0) {
    startValue = page * limit - limit; // 0, 10, 20, 30
    endValue = page * limit; // 10, 20, 30, 40
  } else {
    startValue = 0;
    endValue = 60;
  }
  const tenlsp_lsp = req.params.tenlsp;
  database
    .table("sanpham as sp")
    .join([
      {
        table: "phobien as pb",
        on: `pb.mapb = sp.mapb`,
      },
      {
        table: "loaisp as lsp",
        on: `lsp.malsp = sp.malsp`,
      },
    ])
    .withFields([
      "lsp.tenlsp",
      "lsp.malsp",
      "lsp.hinhlsp",
      "sp.tensp",
      "sp.dongiamoi",
      "sp.dongiacu",
      "sp.giamgia",
      "sp.hinhsp",
      "sp.hinhsp2",
      "sp.hinhsp3",
      "sp.hinhsp4",
      "sp.soluong",
      "pb.mapb",
      "pb.tensppb",
      "sp.masp",
    ])
    .filter({ "lsp.tenlsp": { $like: tenlsp_lsp } })
    .slice(startValue, endValue)
    .sort({ masp: 0.1 })
    .getAll()
    .then((prods) => {
      if (prods.length > 0) {
        res.status(200).json({
          count: prods.length, //đếm số lượng sản phẩm
          products: prods,
        });
      } else {
        res.json({ message: `No products founds from $ { tenlsp_lsp }` });
      }
    })
    .catch((err) => console.log(err));
});

productsRouter.get("/phobien/:tensppb", function (req, res) {
  let page =
    req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1;
  const limit =
    req.query.limit !== undefined && req.query.limit !== 0
      ? req.query.limit
      : 60; // set limit of items per page
  let startValue;
  let endValue;
  if (page > 0) {
    startValue = page * limit - limit; // 0, 10, 20, 30
    endValue = page * limit; // 10, 20, 30, 40
  } else {
    startValue = 0;
    endValue = 60;
  }

  const tensppb = req.params.tensppb;

  database
    .table("sanpham as sp")
    .join([
      {
        table: "loaisp as lsp",
        on: `lsp.malsp = sp.malsp`,
      },
      {
        table: "phobien as pb",
        on: `pb.mapb = sp.mapb`,
      },
    ])
    .withFields([
      "lsp.tenlsp",
      "lsp.malsp",
      "lsp.hinhlsp",
      "sp.tensp",
      "sp.dongiamoi",
      "sp.dongiacu",
      "sp.giamgia",
      "sp.hinhsp",
      "sp.hinhsp2",
      "sp.hinhsp3",
      "sp.hinhsp4",
      "sp.soluong",
      "pb.mapb",
      "pb.tensppb",
      "sp.masp",
    ])
    .filter({ "pb.tensppb": { $like: tensppb } })
    .slice(startValue, endValue)
    .sort({ masp: 0.1 })
    .getAll()
    .then((prods) => {
      if (prods.length > 0) {
        res.status(200).json({
          count: prods.length,
          products: prods,
        });
      } else {
        res.json({ message: `No products founds from $ {tensppb}` });
      }
    })
    .catch((err) => console.log(err));
});
// Create 1 new Product
productsRouter.post("/add", async (req, res) => {
  const prodData = req.body;

  const tensp = prodData.tensp;
  const dongiamoi = prodData.dongiamoi;
  const dongiacu = prodData.dongiacu;
  const giamgia = prodData.giamgia;
  const soluong = prodData.soluong;
  const hinhsp = prodData.hinhsp;
  const hinhsp2 = prodData.hinhsp2;
  const hinhsp3 = prodData.hinhsp3;
  const hinhsp4 = prodData.hinhsp4;
  const malsp = prodData.malsp;
  const mapb = prodData.mapb;
  database
    .table("sanpham")
    .insert({
      tensp: tensp,
      dongiamoi: dongiamoi,
      dongiacu: dongiacu,
      giamgia: giamgia,
      soluong: soluong,
      hinhsp: hinhsp,
      hinhsp2: hinhsp2,
      hinhsp3: hinhsp3,
      hinhsp4: hinhsp4,
      malsp: malsp,
      mapb: mapb,
    })
    .then((prods) => {
      if (prods > 0) {
        res.status(201).json({
          message: "Tạo sản phẩm thành công",
        });
      } else {
        res.status(501).json({ message: `Tạo sản phẩm thất bại` });
      }
    })
    .catch((err) => console.log(err));
});
// Update 1 Product
productsRouter.put("/update/:masp", (req, res) => {
  const masp = req.params.masp;

  if (!isNaN(masp)) {
    database
      .table("sanpham")
      .filter({ masp: masp })
      .update({
        tensp: tensp,
        dongiamoi: dongiamoi,
        dongiacu: dongiacu,
        giamgia: giamgia,
        soluong: soluong,
        hinhsp: hinhsp,
        hinhsp2: hinhsp2,
        hinhsp3: hinhsp3,
        hinhsp4: hinhsp4,
        malsp: malsp,
        mapb: mapb,
      })
      .then((successNum) => {
        if (successNum == 1) {
          res.status(200).json({
            message: `Đã sửa mã ${masp} này`,
            status: "thành công",
          });
        } else {
          res
            .status(500)
            .json({ status: "thất bại", message: "không thể sửa sản phẩm" });
        }
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res
      .status(500)
      .json({ message: "Mã này ko phải là số", status: "thất bại" });
  }
});
// Delete 1 Product
productsRouter.delete("/delete/:masp", async (req, res) => {
  const masp = req.params.masp;
  if (!isNaN(masp)) {
    database
      .table("sanpham")
      .filter({ masp: masp })
      .remove()
      .then((successNum) => {
        if (successNum == 1) {
          res.status(200).json({
            message: `Đã xóa mã ${masp} này`,
            status: "thành công",
          });
        } else {
          res
            .status(500)
            .json({ status: "thất bại", message: "không thể xóa sản phẩm" });
        }
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res
      .status(500)
      .json({ message: "Mã này ko phải là số", status: "thất bại" });
  }
});

export default productsRouter;
