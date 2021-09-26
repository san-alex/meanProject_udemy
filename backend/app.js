const express = require("express");
const path = require("path");
// const bodyParser = require('body-parser');

postRoutes = require('./routes/posts');
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(
    "mongodb+srv://san:SrGkd6GUj0QBn4aR@santoshcluster.bk1my.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to DB");
  })
  .catch((eror) => {
    console.log("connection failed DB", eror);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});

app.use(postRoutes);

app.get((req, res, next) => {
  res.sendStatus(400);
});

module.exports = app;

