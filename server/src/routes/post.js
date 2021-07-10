const express = require("express");
const verifyToken = require("../middleware/auth");
const postController = require('../Controllers/PostController');
const router = express.Router();

/**
 * @route POST api/posts
 * @description Create post
 * @access private
 */

router.post("/", verifyToken, postController.create);

/**
 * @route GET api/posts
 * @description Get all posts
 * @access private
 */

router.get('/', postController.getAll);

module.exports = router;
