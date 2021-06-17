const express = require("express");
const router = express.Router();
const managerCtrl = require("../controllers/manager.controller");
const db = require("../utils/db");

router.use("/product", require("./product.route"));
// router.use("/user", require("./user.route"));
router.get("/resetRevenues/:id", managerCtrl.resetRevenues);
router.get("/BookingList", managerCtrl.BookingList);
router.get("/confirm", managerCtrl.confirmBooking);
router.get("/cancel", managerCtrl.cancelBooking);
router.get("/", managerCtrl.index);

module.exports = router;
