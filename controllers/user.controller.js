const userModel = require("../models/user.model");
const db = require("../utils/db");
module.exports = {
    updateInfo: async function (req, res) {
        const User = {
            userID: req.cookies.user_data.userID,
            userFName: req.body.userFName,
            userPassword: req.body.userPassword,
            userEmail: req.body.userEmail,
            userPhone: req.body.userPhone,
            userGender: req.body.userGender
        };
        if (req.body.userPassword != "") {
            await userModel.update(User, User.userID);
        }
        else {
            delete User.userPassword;
            await userModel.update(User, User.userID);

        }
        req.cookies.user_data.userFName= User.userFName;

          console.log( req.cookies.user_data);
        res.redirect('/profile');
    },
    updateImage: async function (req, res) {
        const User = {
            userID: req.cookies.user_data.userID,
            userPic: req.file.filename
        };
        console.log(User);

        await userModel.update(User, User.userID);

        res.redirect('/profile');
    }
};
