"use strict";

const express = require("express");
const { asyncHandler } = require("./middleware/async-handler");
const { User, Course } = require("./models");
const { authenticateUser } = require("./middleware/auth-user");

// Construct router instance
const router = express.Router();

// Route that will return current authenticated user

// Route that creates a new user

// Route that returns all courses
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    let courses = await Course.findAll();
    res.status(200).json(courses);
  })
);

module.exports = router;
