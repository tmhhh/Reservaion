const express = require("express");
const router = express.Router();
const managerCtrl = require("../controllers/manager.controller");
const db = require("../utils/db");

router.use("/product", require("./product.route"));
// router.use("/user", require("./user.route"));
router.get("/resetRevenues/:id", async (req, res) => {
  const query = `CALL ResetRevenues(?)`;
  const rs = await db.getByCondition(query, req.params.id);
  res.redirect("/manager");
});
router.get("/", managerCtrl.index);

module.exports = router;
