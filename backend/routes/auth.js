import express from "express";
import { body } from "express-validator";
import { secret } from "../config/helpers.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const authRouter = express.Router();
// LOGIN ROUTE
authRouter.post("/login", async (req, res) => {
  let email = req.body.email;
  let matkhau = req.body.matkhau;
  let token = jwt.sign(
    {
      statue: "true",
      email: email,
      matkhau: matkhau,
    },
    secret,
    {
      algorithm: "HS512",
      expiresIn: "4h",
    }
  );
  res.json({ token: token, auth: true, email: email, matkhau: matkhau });

  // helper.database.table('nguoidung')
  //     .withFields(['mand', 'tennd', 'diachi', 'sdt', 'email', 'matkhau', 'role'])
  //     .filter({ 'email': email, 'matkhau': matkhau })
  //     .getAll()
  //     .then(user => {
  //         if (user > 0) {
  //             res.status(201).json({ message: 'Đăng nhập thành công.' });
  //         } else {
  //             res.status(501).json({
  //                 message: `Đăng nhập thất bại  ${email} và ${matkhau}`
  //             });
  //         }
  //     }).catch(err => console.log(err));
});

// REGISTER ROUTE
authRouter.post(
  "/register",
  [
    body("email").custom((value) => {
      return helper.database
        .table("nguoidung")
        .filter({
          $or: { email: value },
        })
        .get()
        .then((user) => {
          if (user) {
            console.log(user);
            return Promise.reject("email đã tồn tại.");
          }
        });
    }),
  ],
  async (req, res) => {
    const userData = req.body;

    const tennd = userData.tennd;
    const diachi = userData.diachi;
    const sdt = userData.sdt;
    const email = userData.email;
    const matkhau = userData.matkhau;

    bcrypt.hashSync(matkhau, 10, (err, hash) => {
      helper.database
        .table("nguoidung")
        .insert({
          tennd: tennd,
          diachi: diachi,
          sdt: sdt,
          email: email,
          matkhau: hash,
          role: "user",
        })
        .then((lastId) => {
          if (lastId > 0) {
            res.status(201).json({ message: "Đăng kí thành công." });
          } else {
            res.status(501).json({ message: "Đăng kí thất bại." });
          }
        })
        .catch((err) => console.log(err));
    });
  }
);

export default authRouter;
