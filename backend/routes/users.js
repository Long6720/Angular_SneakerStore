import express from "express";
import { database } from "../config/helpers.js";

const usersRouter = express.Router();

/* GET users listing. */
usersRouter.get("/", function (req, res) {
  database
    .table("nguoidung")
    .withFields(["tennd", "diachi", "sdt", "email", "matkhau", "mand", "role"])
    .sort({ mand: 0.1 })
    .getAll()
    .then((list) => {
      if (list.length > 0) {
        res.json({ nguoidung: list });
      } else {
        res.json({ message: "NO USER FOUND" });
      }
    })
    .catch((err) => res.json(err));
});

/* GET ONE USER MATCHING ID */
usersRouter.get("/:mand", (req, res) => {
  let userId = req.params.mand;
  database
    .table("nguoidung")
    .filter({ mand: userId })
    .withFields(["tennd", "diachi", "sdt", "email", "matkhau", "mand", "role"])
    .get()
    .then((user) => {
      if (user) {
        res.json({ user });
      } else {
        res.json({ message: `NO USER FOUND WITH ID : ${mand}` });
      }
    })
    .catch((err) => res.json(err));
});

/* UPDATE USER DATA */
usersRouter.patch("/:userId", async (req, res) => {
  let userId = req.params.mand; // Get the User ID from the parameter

  // Search User in Database if any
  let user = await database.table("nguoidung").filter({ mand: userId }).get();
  if (user) {
    let userEmail = req.body.email;
    let userPassword = req.body.matkhau;
    let userName = req.body.tennd;
    let userAddress = req.body.diachi;
    let userNumberPhone = req.body.sdt;

    // Replace the user's information with the form data ( keep the data as is if no info is modified )
    database
      .table("nguoidung")
      .filter({ mand: userId })
      .update({
        email: userEmail !== undefined ? userEmail : user.email,
        matkhau: userPassword !== undefined ? userPassword : user.matkhau,
        tennd: userName !== undefined ? userName : user.username,
        diachi: userAddress !== undefined ? userAddress : user.diachi,
        sdt: sdt !== undefined ? userNumberPhone : user.sdt,
      })
      .then((result) => res.json("Cập nhật người dùng thành công"))
      .catch((err) => res.json(err));
  }
});

export default usersRouter;
