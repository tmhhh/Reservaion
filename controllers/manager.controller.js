const restaurantModel = require("../models/restaurant.model");
const userModel = require("../models/user.model");
const reserveModel = require("../models/reservation.model");
const db = require("../utils/db");
module.exports = {
  index: async function (req, res) {
    const user_id = req.user.userID;
    const listRestaunrant = await restaurantModel.getAllByManager(user_id);
    req.session.myRestaurant = listRestaunrant;
    const revenues = await db.getAll("revenues");
    req.session.revenues = revenues;
    res.render("vwAdmin/managerPage", {
      layout: "manager",
      session: req.session,
      // cookie: req.cookies,
    });
  },
  resetRevenues: async function (req, res) {
    const query = `CALL ResetRevenues(?)`;
    const rs = await db.getByCondition(query, req.params.id);
    res.redirect("/manager");
  },
  BookingList: async function (req, res) {
    let managerID = req.cookies.user_data.userID;
    const BookingList = await reserveModel.getBookingList(managerID, false);
    req.session.BookingList = BookingList[0];
    res.render("vwAdmin/bookingList", {
      layout: "manager",
      BookingList: req.session.BookingList,
    });
  },
  confirmBooking: async function (req, res) {
    var rs = await reserveModel.confirm(req.query);
    rs = await reserveModel.updateRevenues(req.body.rid, date.getMonth() + 1);
    res.redirect("/manager/BookingList");
  },
  cancelBooking: async function (req, res) {
    const rs = await reserveModel.cancel(req.query);
    res.redirect("/manager/BookingList");
  },
};
