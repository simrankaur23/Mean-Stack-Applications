const express = require("express");
const PostController = require("../Controllers/post");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const router = express.Router();

router.post(
    "",
    checkAuth,
    extractFile,
    PostController.createPost
)

router.put(
    "/:id",
    checkAuth,
    extractFile,
    PostController.updatePost
)

router.get(
    "",
    PostController.getPost
)

router.get(
    "/:id",
    PostController.getfetchPost
)

router.delete(
    "/:id",
    checkAuth,
    PostController.deletePost
)

module.exports = router;

