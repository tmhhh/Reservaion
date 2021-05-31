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
const e = require("express");

router.get("/", async function (req, res) {
  const listRestaunrant = await restaurantModel.getAll();
  req.session.listRes = listRestaunrant;
  const { cookies } = req;
  if ("user_data" in cookies) {
    const user = req.cookies.user_data;
    var favoriteList = await favoriteModel.getList(user.userID);
    favoriteList = favoriteList.map((e) => e.rid);
    req.session.favoriteList = favoriteList;
  } else req.session.favoriteList = null;
  res.render("homepage", {
    cookie: req.cookies,
    listRestaunrant: req.session.listRes,
    session: req.session,
  });
});

//user profile
router.use("/profile", require("./user.route"));

//signup
router.get("/signup", function (req, res) {
  res.render("vwSignIn&SignUp/signUp");
});
router.post(
  "/signup",
  upload("user").single("picture"),
  async function (req, res) {
    const user = { ...req.body, userPic: req.file.filename };
    const result = await userModel.add(user);
    if (result.affectedRows === 1) {
      res.redirect("/login");
    } else {
      res.redirect("/signup");
    }
  }
);

router.get("/login", function (req, res) {
  res.render("vwSignIn&SignUp/signIn");
});
router.post("/login", async function (req, res) {
  const result = await userModel.login(req.body);
  if (Object.values(result) != 0) {
    res.cookie("user_data", result[0]);
    res.redirect("/");
  } else {
    res.send("fail");
  }
});
router.get("/logout", (req, res) => {
  res.clearCookie("user_data");
  res.redirect("/");
});

//resDatail page
router.get("/resDetail", async function (req, res) {
  const restaurant = await restaurantModel.getResByID(req.query.id);
  const rImages = await resImageModel.getByID(req.query.id);
  const feedback = await feedbackModel.getFeedBackAndUsersByID(req.query.id);
  const reply = await replyFBModel.getReplyAndUsersByID(req.query.id);
  const rating = await restaurantModel.getRatingByID(req.query.id);
  // console.log(restaurant[0]);
  // console.log('------');
  // console.log(restaurant);
  res.render("productDetail", {
    cookie: req.cookies,
    Feedback: feedback,
    Restaurant: restaurant[0],
    rImages,
    Reply: reply,
    Rating: rating[0],
    layout: "main",
  });
});

//feedback
router.post("/resDetail", async function (req, res) {
  var date = new Date();
  console.log(date);
  const feedback = {
    userID: +req.cookies.user_data.userID,
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
      userID: +req.cookies.user_data.userID,
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
  console.log(req.body.searchInput);
  const result = await restaurantModel.search(req.body.searchInput);
  console.log(result);
  res.render("homepage", {
    cookie: req.cookies,
    session: req.session,
    listRestaunrant: result[0]
  });
});

//add favorite list
router.get("/favorite/:id", middleware.isLogined, async function (req, res) {
  var rid = +req.params.id;
  var uid = +req.cookies.user_data.userID;
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
  const favList = await favoriteModel.getListFavorite(
    req.cookies.user_data.userID
  );
  res.render("favoriteList", {
    cookie: req.cookies,
    session: req.session,
    FavoriteList: favList[0],
  });
});

//Booking
router.post("/booking", middleware.isLogined, async function (req, res) {
  var date = new Date(req.body.ReserveTime);
  const reservation = {
    ...req.body,
    uid: req.cookies.user_data.userID,
  };
  var rs = await reservationModel.add(reservation);
  rs = await reservationModel.updateRevenues(req.body.rid, date.getMonth() + 1);
  res.redirect(`resDetail?id=${req.body.rid}`);
});

//Rating
router.post("/rating", middleware.isLogined, async function (req, res) {
  const rs = await restaurantModel.rating(req.body.rid, req.body.rating);
  res.redirect(`resDetail?id=${req.body.rid}`);
});
module.exports = router;
