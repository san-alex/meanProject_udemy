const express = require("express");

const multer = require("multer");

const Post = require("../models/post");

const middleware = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid file type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + ext);
  },
});

router.post(
  "/api/posts",
  middleware,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });
    console.log(post);
    post
      .save()
      .then((createdPost) => {
        res.status(201).json({
          message: "Post added successfully",
          post: {
            ...createdPost,
            id: createdPost._id,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({ message: "creating post failed!" });
      });
  }
);

router.put(
  "/api/posts/:id",
  middleware,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId,
    });
    // console.log(post);
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then((result) => {
        if (result.modifiedCount > 0)
          res.status(200).json({ message: "Update successful!" });
        else res.status(401).json({ message: "not auherized!" });
      })
      .catch((err) => {
        res.status(500).json({ message: "updating post failed!" });
      });
  }
);

router.get("/api/posts", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currPage = +req.query.currPage;
  const postQuery = Post.find();
  let pageDocs;
  if (pageSize && currPage) {
    postQuery.skip(pageSize * (currPage - 1)).limit(pageSize);
  }
  postQuery
    .then((docs) => {
      pageDocs = docs;
      return Post.count();
    })
    .then((count) => {
      res.json({
        message: "get success",
        posts: pageDocs,
        maxPosts: count,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "getting posts failed!" });
    });
});

router.get("/api/posts/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "getting post failed!" });
    });
});

router.delete("/api/posts/:id", middleware, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((resp) => {
      console.log(resp);
      if (resp.deletedCount > 0)
        res.status(200).json({ message: "deleted successfully!" });
      else res.status(401).json({ message: "not auherized!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "deleting post failed!" });
    });
});

module.exports = router;
