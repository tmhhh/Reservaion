const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

//view template
require("./middleware/view.mdw")(app);

//configure to static files
require("./middleware/config.mdw")(app);

//cookie
require("./middleware/cookie.mdw")(app);

//session
require("./middleware/session.mdw")(app);

//File upload

///////////---------///////////////

app.use("/", require("./routes/main.route"));

app.use(
  "/admin",
  (req, res, next) => {
    const { cookies } = req;
    if ("user_data" in cookies) {
      const user = req.cookies.user_data;
      if (user.userType == 1) {
        next();
      } else res.redirect("/");
    } else res.redirect("/");
  },
  require("./routes/admin.route")
);

app.use(
  "/manager",
  (req, res, next) => {
    const { cookies } = req;
    if ("user_data" in cookies) {
      const user = req.cookies.user_data;
      if (user.userType == 2) {
        next();
      } else res.redirect("/");
    } else res.redirect("/");
  },
  require("./routes/manager.route")
);

app.use(function (req, res) {
  res.send("error");
});
app.listen(PORT, function () {
  console.log(`Sever is running at http://localhost:${PORT}`);
});
