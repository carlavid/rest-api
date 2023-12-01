"use strict";

const express = require("express");
const { asyncHandler } = require("./middleware/async-handler");
const { User, Course } = require("./models");
const { authenticateUser } = require("./middleware/auth-user");
const bcrypt = require("bcryptjs");

// Construct router instance
const router = express.Router();

/** User Routes **/
// Route that will return current authenticated user
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const password = req.currentUser.password;
    console.log(password);

    res.status(200).json(user);
  })
);

// Route that creates a new user
// & hashes the user's password before persisting
// user to the database
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
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const courses = await Course.findAll();
      const newCourse = await Course.create(req.body);

      newCourse.id = courses.length + 1;
      courses.push(newCourse);

      res.location(`api/courses/${newCourse.id}`);
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

// Route that will update corresponding course
router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const courseId = req.params.id;
      const course = await Course.findOne({ where: { id: courseId } });
      const updatedCourse = req.body;

      await course.update(updatedCourse);
      res.status(204).end();
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

// Route that will delete corresponding course
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const courseId = req.params.id;
    const course = await Course.findOne({ where: { id: courseId } });

    await course.destroy();
    res.status(204).end();
  })
);

module.exports = router;
