const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const { upload } = require("../controllers/upload.controller");
const authenticalMDW =require('../middleware/authenticate.mdw');
router.get("/",authenticalMDW.isLogined ,function (req, res) {
  // console.log('-------------');
  // console.log(req.session.user);
  res.render("userProfile", {
    // cookie:  req.user
  });
});
router.post("/info", authenticalMDW.isLogined ,userCtrl.updateInfo);
router.post("/image",  authenticalMDW.isLogined,upload("user").single("userPic"), userCtrl.updateImage);

module.exports = router;
