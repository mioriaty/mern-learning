const Post = require("../models/PostModel");

class PostController {
  /**
   * @route POST api/posts
   * @description Create post
   * @access private
   */
  async create(req, res) {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    try {
      const newPost = new Post({
        title,
        description,
        status: status || "TO LEARN",
        user: req.userId,
      });

      await newPost.save();

      res.json({
        success: true,
        message: "Created successfully",
        data: newPost,
      });
      
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        success: false,
        message: "Interval server error",
      });
    }
  }

  /**
   * @route GET api/posts
   * @description Get all posts
   * @access private
   */
  async getAll(req, res) {
    await Post.find({}).then((posts) => {
      res.json({
        success: true,
        message:
          posts.length > 0
            ? "Get all posts successfully"
            : "No posts in database",
        data: posts,
      });
    });
  }
}

module.exports = new PostController();
