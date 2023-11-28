"use strict";

const express = require("express");
const { asyncHandler } = require("./middleware/async-handler");
const { User, Course } = require("./models");
const { authenticateUser } = require("./middleware/auth-user");

// Construct router instance
const router = express.Router();

// Route that will return current authenticated user
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      password: user.password,
    });
  })
);

// Route that creates a new user

// Route that returns all users
// router.get(
//   "/users",
//   asyncHandler(async (req, res) => {
//     let users = await User.findAll();
//     res.status(200).json(users);
//   })
// );

// Route that returns all courses
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    let courses = await Course.findAll();
    res.status(200).json(courses);
  })
);

module.exports = router;
