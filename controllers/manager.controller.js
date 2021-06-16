const restaurantModel = require("../models/restaurant.model");
const userModel = require("../models/user.model");
const db = require("../utils/db");
module.exports = {
  index: async function (req, res) {
    const user_id = req.session.user.userID;
    const listRestaunrant = await restaurantModel.getAllByManager(user_id);
    req.session.myRestaurant = listRestaunrant;
    const revenues = await db.getAll("revenues");
    req.session.revenues = revenues;
    res.render("vwAdmin/managerPage", {
      layout: "manager",
      session: req.session,
    });
  },
};
