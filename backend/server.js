import createError from "http-errors";
import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import cors from "cors";
import popularRouter from "./routes/popular.js";
import ordersRouter from "./routes/orders.js";
import authRouter from "./routes/auth.js";
import productOTRouter from "./routes/productOfType.js";
import productsRouter from "./routes/products.js";
import usersRouter from "./routes/users.js";

const app = express();

//CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "DELETE", "PATCH", "POST"],
    allowedHeaders:
      "Content-Type, Authorization, Origin, X-Requested-With, Accept",
  })
);

// view engine setup

app.use(logger("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Use Routes
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/productOfType", productOTRouter);
app.use("/api/popular", popularRouter);
app.use("/api/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
