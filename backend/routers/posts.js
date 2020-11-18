const express = require("express");

const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const uploadFile = require("../middleware/uploadFile");

const postsController = require('../controller/posts');


// router.post("", uploadFile, (req, res, next) => {
router.post("", checkAuth, postsController.createPosts);

router.get("", postsController.getPosts);

router.delete("/:id", checkAuth, postsController.deletePost);

router.get("/:id", postsController.getPost);

router.put("/:id", checkAuth, postsController.updatePost);

module.exports = router;