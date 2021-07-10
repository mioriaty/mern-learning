const express = require("express");
const authController = require('../Controllers/AuthController');

const router = express.Router();

/**
 * @route POST api/auth/register
 * @description Register user
 * @access public
 */

router.post("/register", authController.register);

/**
 * @route POST api/auth/login
 * @description Login
 * @access public
 */
router.post("/login", authController.login);

module.exports = router;
