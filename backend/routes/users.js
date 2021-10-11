const express = require("express");

const User = require("../models/user");

const router = express.Router();

router.post("/api/user/login", (req, res, next) => {
  //console.log(req.body.email, req.body.password);
  User.findOne({ email: req.body.email })
    .then((result) => {
      console.log(result);
      if (!result) {
        return res.status(404).json({ message: "user not found!" });
      }
      res.status(200).json({ message: "login success!" });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.post("/api/user/signup", (req, res, next) => {
  let hashedPass = req.body.password;
  const user = new User({
    email: req.body.email,
    password: hashedPass,
  });
  user
    .save()
    .then((result) => {
      res.status(201).json({ message: "user created successfully!" });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

module.exports = router;
