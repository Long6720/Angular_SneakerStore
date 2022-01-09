import MySqli from "mysqli";
import bcrypt from "bcryptjs";

const conn = new MySqli({
  host: "localhost",
  port: "3306",
  user: "root",
  pass: "",
  db: "ql_giaydep",
});
export const secret = "1SBz93MsqTs7KgwARcB0I0ihpILIjk3w";

export const database = conn.emit(false, "");

export const hasAuthFields = (req, res, next) => {
  let errors = [];
  if (req.body) {
    if (!req.body.email) {
      errors.push("Chưa nhập email");
    }
    if (!req.body.matkhau) {
      errors.push("Chưa nhập mật khẩu");
    }

    if (errors.length) {
      return res.status(400).send({ errors: errors.join(" , ") });
    } else {
      return next();
    }
  } else {
    return res.status(400).send({ errors: "Chưa nhập email và mật khẩu" });
  }
};

export const isPasswordAndUserMatch = async (req, res, next) => {
  const myPassword = req.body.matkhau;
  const myEmail = req.body.email;
  const myUsername = req.body.tennd;

  const user = await db
    .table("nguoidung")
    .filter({ $or: [{ email: myEmail }, { tennd: myUsername }] })
    .get();
  if (user) {
    const match = await bcrypt.compare(myPassword, user.matkhau);
    if (match) {
      req.tennd = user.tennd;
      req.email = user.email;
      next();
    } else {
      res.status(401).send("Email hoặc mật khẩu không đúng");
    }
  } else {
    res.status(401).send("Email hoặc mật khẩu không đúng");
  }
};
