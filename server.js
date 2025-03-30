const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const UserController = require("./controllers/userControllers");
const productController = require("./controllers/productController");
const billController = require("./controllers/billController");
const transactionController = require("./controllers/transactionController");

// user
app.post("/api/user/create", (req, res) => UserController.create(req, res));
app.get("/api/user/list", (req, res) => UserController.list(req, res));
app.put("/api/user/update/:id", (req, res) => UserController.update(req, res));
app.delete("/api/user/delete/:id", (req, res) =>
  UserController.delete(req, res)
);
app.post("/api/user/login", (req, res) => UserController.Login(req, res));

// product
app.post("/api/product/create", (req, res) =>
  productController.create(req, res)
);
app.get("/api/product/list", (req, res) => productController.list(req, res));
app.put("/api/product/update/:id", (req, res) => productController.update(req, res));
app.delete("/api/product/delete/:id", (req, res) => productController.delete(req, res));

// bill
app.post("/api/bill/payment", (req, res) => billController.create(req, res));
app.get("/api/bill/list/:id", (req, res) => billController.list(req, res));

// transaction
app.post("/api/transaction/list", (req, res) =>
  transactionController.list(req, res)
);

app.listen(3004, () => {
  console.log("server is running on port 3004");
});
