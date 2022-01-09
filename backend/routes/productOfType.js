import express from "express";
import { database } from "../config/helpers.js";

const productOTRouter = express.Router();

productOTRouter.get("/", function (req, res) {
  let page =
    req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1; // set the current page number
  const limit =
    req.query.limit !== undefined && req.query.limit !== 0
      ? req.query.limit
      : 10; // set the limit of ites per page
  let startValue;
  let endValue;

  if (page > 0) {
    startValue = page * limit - limit; //0,10,20,30
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 10;
  }

  database
    .table("loaisp as lsp")
    .withFields(["lsp.malsp as malsp", "lsp.tenlsp as tenlsp", "lsp.hinhlsp"])
    .slice(startValue, endValue)
    .sort({ malsp: 0.1 })
    .getAll()
    .then((prods) => {
      if (prods.length > 0) {
        res.status(200).json({
          count: prods.length, //đếm số lượng sản phẩm
          products: prods,
        });
      } else {
        res.json({ message: "No product of type founds" });
      }
    })
    .catch((err) => console.log(err));
});
export default productOTRouter;
