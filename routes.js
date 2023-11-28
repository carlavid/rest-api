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
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      // set location header
      res.location("/");
      // return 201 status code and no content
      res.status(201).end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

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
