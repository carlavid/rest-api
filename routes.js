"use strict";

const express = require("express");
const { asyncHandler } = require("./middleware/async-handler");
const { User, Course } = require("./models");
const { authenticateUser } = require("./middleware/auth-user");

// Construct router instance
const router = express.Router();

/** User Routes **/
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

/** Courses Routes **/
// Route that returns all courses and associated user
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    let courses = await Course.findAll({
      include: [
        {
          model: User,
        },
      ],
    });
    res.status(200).json(courses);
  })
);

// Route that will return corresponding course
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const courseId = req.params.id;
    const course = await Course.findOne({
      where: { id: courseId },
      include: {
        model: User,
      },
    });
    res.status(200).json(course);
  })
);

// Route that will create a new course

// Route that will update corresponding course

// Route that will delete corresponding course

module.exports = router;
