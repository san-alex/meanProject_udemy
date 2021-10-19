const express = require("express");

const postController = require("../controllers/post");

const middleware = require("../middleware/check-auth");
const multerMiddleware = require("../middleware/file");

const router = express.Router();

router.post(
  "/api/posts",
  middleware,
  multerMiddleware,
  postController.createPost
);

router.put(
  "/api/posts/:id",
  middleware,
  multerMiddleware,
  postController.updatePost
);

router.get("/api/posts", postController.getPosts);

router.get("/api/posts/:id", postController.getPost);

router.delete("/api/posts/:id", middleware, postController.deletPost);

module.exports = router;
