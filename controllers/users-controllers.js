const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Token = require("../models/token");
const sendEmail = require("../util/send-email");
const crypto = import("crypto");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.find({ email: email });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Signing up failed, please try again later",
      500
    );
    return next(error);
  }

  if (existingUser.length !== 0) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user, please try again", 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log in, please check credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

const emailVerify = async (req, res, next) => {
  try {
    const { email } = req.body;
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch {
      const error = new HttpError(
        "Sorry, something went wrong, please try again later.",
        500
      );
      return next(error);
    }

    if (!existingUser) {
      const error = new HttpError(
        "Email does not exist",
        403
      );
      return next(error);
    }

    let token = await new Token({
      userId: existingUser.id,
      token: jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      )
    }).save();

    const message = `${process.env.BASE_URL}/email-verify/${existingUser.id}/${token.token}`;
    await sendEmail(email, "Verify Email", message);
    res.json("An Email sent to your account. Please verify")
  } catch (error) {
    return next(error);
  }
}

const getVerified = async(req, res, next) => {
  let existingUser;
  try {
    existingUser = await User.findOne({ _id: req.params.id });
  } catch (error) {
    return next(new HttpError(
      "Sorry, something went wrong, please try again later.",
      500
    ));
  }

  if(!existingUser) {
    const error = new HttpError("Invalid Link", 400);
    return next(error);
  }

  const token = await Token.findOne({
    userId: existingUser.id,
    token: req.params.token,
  });

  if(!token) {
    const error = new HttpError("Invalid Link", 400);
    return next(error);
  }

  let userToken;
  try {
    userToken = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again later.", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: userToken,
  });
}

const resetPassword = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { userId, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.find({ _id: userId });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Signing up failed, please try again later",
      500
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user, please try again", 500);
    return next(error);
  }

  try {
    await User.findOneAndUpdate({ _id: userId }, { password: hashedPassword })
  } catch (err) {
    const error = new HttpError(
      "Resetting password failed. Please try again later",
      500
    );
    return next(error);
  }

  res
    .json("Password was reset successfully");
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.emailVerify = emailVerify;
exports.getVerified = getVerified;
exports.resetPassword = resetPassword;
