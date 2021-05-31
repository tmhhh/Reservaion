const express = require("express");
const router = express.Router();
const userCtrl= require('../controllers/user.controller');
const { upload } = require("../controllers/upload.controller");
router.get('/', function (req, res) {
    res.render('userProfile', {
        cookie: req.cookies
    });
});
router.post('/info',userCtrl.updateInfo);
router.post('/image',upload("user").single("userPic"), userCtrl.updateImage);

module.exports = router;
