const Post = require("../models/post");

exports.createPost = (req, res, next) => {
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
};

exports.updatePost = (req, res, next) => {
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
};

exports.getPosts = (req, res, next) => {
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
};

exports.getPost = (req, res, next) => {
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
};

exports.deletPost = (req, res, next) => {
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
};
