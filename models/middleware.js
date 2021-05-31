module.exports = {
  isLogined: function (req, res, next) {
    const { cookies } = req;
    if ("user_data" in cookies) {
      next();
    } else res.redirect("/login");
  },
};
