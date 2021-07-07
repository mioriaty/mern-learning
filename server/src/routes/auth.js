const express = require('express');
const UserModel = require('../models/UserModel');

const rounter = express.Router();

/** 
 * @route POST api/auth/register
 * @description Register user
 * @access public
 */
rounter.post('/register', async (req, res) => {
  const {
    username,
    password
  } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing username or password"
    })
  }
  try {
    // check existing user
    const user = await UserModel.findOne({
      username
    });
    if (user) {
      res.status(400).json({
        success: false,
        message: "Username has already existed"
      })
    }

  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
})


module.exports = rounter;