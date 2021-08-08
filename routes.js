const express = require("express");
const router = express.Router();
const db = require("./db");
const authorization = require("./authorization");

const checkPostExistAndGet = (id) => {
  const getPost = db.posts.find((item) => item.id === Number(id));
  if (!getPost) throw new Error("Post doesn't exist");
  return getPost;
};

router.post("/", async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const { user_id: userId } = req.headers;

    await authorization(userId, "create", req.body);

    const newData = {
      id: Math.floor(Math.random() * 999999 + 1),
      title,
      content,
      userId: Number(userId),
      flagged: false,
    };
    db.posts.push(newData);

    res.status(201).json({
      code: 201,
      data: newData,
      message: "Post created successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const getPosts = db.posts.filter((item) => item.flagged === false);

    const { user_id: userId } = req.headers;
    await authorization(userId, "view:all");

    res.json({
      code: 200,
      data: getPosts,
      message: "All posts fetched successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const getPost = db.posts.find(
      (item) => item.flagged === false && item.id === Number(req.params.id)
    );

    const { user_id: userId } = req.headers;
    await authorization(userId, "view:single");

    res.json({
      code: 200,
      data: getPost,
      message: "Post fetched successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { title, content } = req.body;
    let updatedContent = { title, content };
    const { user_id: userId } = req.headers;

    const postId = req.params.id;
    checkPostExistAndGet(postId);

    const tempUpdatedPosts = db.posts.map((item) => {
      if (item.id === Number(postId)) {
        updatedContent = {
          ...item,
          ...updatedContent,
        };
        return updatedContent;
      }
      return item;
    });

    await authorization(userId, "update", updatedContent);

    db.posts = tempUpdatedPosts;

    res.json({
      code: 200,
      data: updatedContent,
      message: "Post updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { user_id: userId } = req.headers;
    const postId = req.params.id;
    const post = checkPostExistAndGet(postId);

    const allPosts = db.posts.filter(
      (item) => item.flagged === false && item.id !== Number(postId)
    );

    await authorization(userId, "delete", post);

    db.posts = allPosts;

    res.json({
      code: 200,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/flag/:id", async (req, res, next) => {
  try {
    let flaggedContent = {
      flagged: req.body.flag,
    };
    const { user_id: userId } = req.headers;

    const postId = req.params.id;
    checkPostExistAndGet(postId);

    const tempUpdatedPosts = db.posts.map((item) => {
      if (item.id === Number(postId)) {
        flaggedContent = {
          ...item,
          ...flaggedContent,
        };
        return flaggedContent;
      }
      return item;
    });

    await authorization(userId, "flag", flaggedContent);

    db.posts = tempUpdatedPosts;

    res.json({
      code: 200,
      data: flaggedContent,
      message: `Post ${req.body.flag ? "flagged" : "unflagged"} successfully`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
