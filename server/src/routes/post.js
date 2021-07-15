const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const postController = require("../Controllers/PostController");
const router = express.Router();

/**
 * @route POST api/posts
 * @description Create post
 * @access private
 */

router.post("/", verifyToken, postController.create);

/**
 * @route GET api/posts
 * @description Get all posts by user
 * @access private
 */
router.get("/", verifyToken, postController.getAllPostsByUser);

/**
 * @route PUT api/posts
 * @description Update post
 * @access private
 */
router.put("/:id", verifyToken, postController.updateById);

module.exports = router;
