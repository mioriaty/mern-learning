const User = require("../models/UserModel");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

class AuthController {
  /**
   * @route POST api/auth/register
   * @description Register user
   * @access public
   */
  async register(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing username or password",
      });
    }

    try {
      // check existing user
      const user = await User.findOne({ username });

      if (user) {
        res.status(400).json({
          success: false,
          message: "Username has already existed",
        });
      }

      // insert new user to db
      const hashedPassword = await argon2.hash(password);
      const newUser = new User({
        username,
        password: hashedPassword,
      });
      await newUser.save();

      // access token
      const accessToken = jwt.sign(
        {
          userId: newUser._id,
        },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.json({
        success: true,
        message: "User created successfully",
        accessToken,
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
   * @route POST api/auth/login
   * @description Login
   * @access public
   */
  async login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing username or password",
      });
    }

    try {
      // check for existing user
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Incorrect username",
        });
      }

      // username found
      // so sánh passowrd user nhập ở input vào password trong database
      const passwordValid = await argon2.verify(user.password, password);
      if (!passwordValid) {
        return res.status(400).json({
          success: false,
          message: "Incorrect password",
        });
      }

      // all good
      const accessToken = jwt.sign(
        {
          userId: user._id,
        },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.json({
        success: true,
        message: "Logged in successfully",
        accessToken,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        success: false,
        message: "Interval server error",
      });
    }
  }
}

module.exports = new AuthController();
