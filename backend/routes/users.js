const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.post("/api/user/login", (req, res, next) => {
  let fetcheduser;
  //console.log(req.body.email, req.body.password);
  User.findOne({ email: req.body.email })
    .then((result) => {
      // console.log(result);
      if (!result) {
        return res.status(404).json({ message: "user not found!" });
      }
      fetcheduser = result;
      return bcrypt.compare(req.body.password, result.password);
    })
    .then((result) => {
      // console.log(result);
      if (!result) {
        return res.status(500).json({ message: "invalid password!" });
      }
      const token = jwt.sign(
        { email: fetcheduser.email, userId: fetcheduser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      console.log('login success!');
      res
        .status(200)
        .json({
          message: "login success!",
          token: token,
          expiresIn: 3600,
          userId: fetcheduser._id,
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.post("/api/user/signup", (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      if (!req.body.email.includes("@")) {
        res.status(400).json({ message: "email is wrong" });
      }
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then((result) => {
          console.log('signed up success!');
          res.status(201).json({ message: "user created successfully!" });
        })
        .catch((err) => {
          res.status(500).json({ message: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

module.exports = router;
