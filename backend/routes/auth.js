var express = require("express");
var router = express.Router();
const User = require("../models/user");
const { check } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name", "Name should be atleast 3 characters.")
      .not()
      .isEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3 }),
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email")
      .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
          User.findOne({ email: req.body.email }, function (err, user) {
            if (err) {
              reject(new Error("Server Error"));
            }
            if (Boolean(user)) {
              reject(new Error("E-mail already in use"));
            }
            resolve(true);
          });
        });
      }),
    check("password", "Password should be atleast 3 characters.").isLength({
      min: 3,
    }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "Email is required.").isEmail(),
    check("password", "Password field is required.").isLength({ min: 3 }),
  ],
  signin
);

router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;
