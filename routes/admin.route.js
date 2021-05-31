const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/admin.controller");

router.use("/product", require("./product.route"));
// router.use("/user", require("./user.route"));

router.get("/products", adminCtrl.getListRes);
router.get("/users", adminCtrl.getListUser);
router.get("/", adminCtrl.index);




module.exports = router;
