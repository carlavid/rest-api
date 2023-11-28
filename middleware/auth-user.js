"use strict";
const auth = require("basic-auth");
const { User } = require("../models");

// Middleware to authenticate request
exports.authenticateUser = async (req, res, next) => {
  let message;
  const credentials = auth(req);

  if (credentials) {
    const user = await User.findOne({
      where: { emailAddress: credentials.name },
    });
    if (user) {
      console.log(
        `Authentication successful for user: ${user.firstName} ${user.lastName}`
      );

      // Store the user on the Request Object.
      req.currentUser = user;
    } else {
      message = `User not found for email address: ${credentials.emailAddress}`;
    }
  } else {
    message = "Auth header not found";
  }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: "Access denied" });
  } else {
    next();
  }
};
