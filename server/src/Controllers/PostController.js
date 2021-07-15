const Post = require("../models/PostModel");

class PostController {
  /**
   * @route POST api/posts
   * @description Create post
   * @access private
   */
  async create(req, res) {
    const { title, description, status } = req.body;

    // validate: title === "" => status 400
    try {
      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }

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
   * @description Get all posts by user
   * @access private
   */
  async getAllPostsByUser(req, res) {
    try {
      const data = await Post.find({ user: req.userId }).populate("user", [
        "username",
      ]);
      const message =
        data.length > 0 ? `Found ${data.length}` : "There are no posts";

      res.json({
        status: 200,
        data,
        message,
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
   * @route PUT api/posts
   * @description Update post
   * @access private
   */
  async updateById(req, res) {
    try {
      const { title, description, status } = req.body;
      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }

      let updatedPost = {
        title,
        description: description || "",
        status: status || "TO LEARN",
      };
      // Kiểm tra _id của post có = với id trên params
      // Kiểm tra userId có đúng với id của user hiện tại không
      const postUpdateCondition = { _id: req.params.id, user: req.userId };

      updatedPost = await Post.findOneAndUpdate(
        postUpdateCondition,
        updatedPost,
        { new: true }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        success: false,
        message: "Interval server error",
      });
    }
  }
}

module.exports = new PostController();
