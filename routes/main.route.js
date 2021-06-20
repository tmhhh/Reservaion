const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model");
const restaurantModel = require("../models/restaurant.model");
const resImageModel = require("../models/resImage.model");
const feedbackModel = require("../models/feedback.model");
const replyFBModel = require("../models/replyFB.model");
const { upload } = require("../controllers/upload.controller");
const favoriteModel = require("../models/favoriteList.model");
const middleware = require("../models/middleware");
const reservationModel = require("../models/reservation.model");
router.get("/", async function (req, res) {
  const listRestaunrant = await restaurantModel.getAll();
  req.session.listRes = listRestaunrant;
  if (req.user) {
    const user = req.user;
    var favoriteList = await favoriteModel.getList(user.userID);
    favoriteList = favoriteList.map((e) => e.rid);
    req.session.favoriteList = favoriteList;
  } else req.session.favoriteList = null;
  res.render("homepage", {
    // cookie: req.cookie.user_data,
    listRestaunrant: req.session.listRes,
    session: req.session,
  });
});

//user profile
router.use("/profile", require("./user.route"));

//signup
router.get("/signup", function (req, res) {
  res.render("vwSignIn&SignUp/signUp", { layout: false });
});
router.post(
  "/signup",
  upload("user").single("picture"),
  async function (req, res) {
    //thieu kiem tra usernameid ton tai chua
    const user = { ...req.body, userPic: req.file.filename };
    const result = await userModel.add(user);
    if (result.affectedRows === 1) {
      res.redirect("/login");
    } else {
      res.redirect("/signup");
    }
  }
);

//login
router.use("/login", require("./login.route"));

//logout
router.get("/logout", (req, res) => {
  // res.clearCookie("user_data");
  req.session.destroy();
  res.redirect("/");
});

//resDatail page
router.get("/resDetail", async function (req, res) {
  const restaurant = await restaurantModel.getResByID(req.query.id);
  const rImages = await resImageModel.getByID(req.query.id);
  const feedback = await feedbackModel.getFeedBackAndUsersByID(req.query.id);
  const reply = await replyFBModel.getReplyAndUsersByID(req.query.id);
  const rating = await restaurantModel.getRatingByID(req.query.id);
  const menu = await restaurantModel.getMenu(req.query.id);
  // console.log(restaurant[0]);
  // console.log('------');
  // console.log(restaurant);
  res.render("productDetail", {
    // cookie: req.cookies,
    Feedback: feedback,
    Restaurant: restaurant[0],
    rImages,
    Reply: reply,
    Rating: rating[0],
    menuData: menu[0] === undefined ? "" : menu[0].menu,
    layout: "main",
  });
});

//feedback
router.post("/resDetail", async function (req, res) {
  var date = new Date();
  console.log(date);
  const feedback = {
    userID: +req.user.userID,
    resID: +req.query.id,
    fbContent: req.body.feedbackContent,
    fbDate: date,
  };
  const result = await feedbackModel.add(feedback);
  res.redirect(`/resDetail?id=${req.query.id}`);
});

//reply

router.post("/resDetail/reply", async function (req, res) {
  if (req.body.replyContent && req.body.replyContent.trim()) {
    var date = new Date();
    const reply = {
      userID: +req.user.userID,
      resID: +req.query.resID,
      fbID: +req.query.fbID,
      repContent: req.body.replyContent,
      repDate: date,
    };
    const result = await replyFBModel.add(reply);
    res.redirect(`/resDetail?id=${req.query.resID}`);
  } else {
    res.send("error");
  }
});

//search Restaurant

router.post("/search", async function (req, res) {
  const result = await restaurantModel.search(req.body.searchInput);
  console.log(result);
  res.render("homepage", {
    session: req.session,
    listRestaunrant: result[0],
  });
});

//search Res by cate
router.get("/search/byCate", (req, res) => {
  const cateID = +req.query.cate;
  var listRestaunrant = [];
  req.session.listRes.forEach((e) => {
    if (e.resCate === cateID) listRestaunrant.push(e);
  });
  res.render("homepage", {
    listRestaunrant,
    session: req.session,
  });
});

//add favorite list
router.get("/favorite/:id", middleware.isLogined, async function (req, res) {
  var rid = +req.params.id;
  var uid = +req.user.userID;
  const favList = req.session.favoriteList;
  if (favList.indexOf(rid) > -1) {
    const result = await favoriteModel.delete([uid, rid]);
  } else {
    const entity = {
      uid,
      rid,
    };
    const result = await favoriteModel.add(entity);
  }
  res.redirect("/");
});
//favorite list page
router.get("/favoriteList", middleware.isLogined, async function (req, res) {
  const favList = await favoriteModel.getListFavorite(req.user.userID);
  res.render("favoriteList", {
    // cookie: req.cookies,
    session: req.session,
    FavoriteList: favList[0],
  });
});

//Booking
router.post("/booking", middleware.isLogined, async function (req, res) {
  var date = new Date(req.body.ReserveTime);
  const reservation = {
    ...req.body,
    uid: req.user.userID,
  };
  const rs = await reservationModel.add(reservation);
  let restaurant = await restaurantModel.getResByID(req.body.rid);
  let managerID = restaurant[0].managerID;
  req.app.io.emit(`booking-${managerID}`, {
    ...reservation,
    resName: restaurant[0].resName,
  });
  res.redirect(`resDetail?id=${req.body.rid}`);
});

//Rating
router.post("/rating", middleware.isLogined, async function (req, res) {
  const rs = await restaurantModel.rating(req.body.rid, req.body.rating);
  res.redirect(`resDetail?id=${req.body.rid}`);
});
module.exports = router;

//View menu
router.get("/viewMenu", async (req, res) => {
  let resID = req.query.id;
  const menu = await restaurantModel.getMenu(resID);
  res.render("viewMenu", {
    layout: "empty",
    menuData: menu[0] === undefined ? "" : menu[0].menu,
  });
});
