import User from "../models/user.model.js";
import errorHandler from "./errorController.js";

const create = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      securityQuestion: req.body.securityQuestion,
      securityAnswer: req.body.securityAnswer,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully!", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// List users (you can protect this with admin in routes)
const list = async (_req, res) => {
  try {
    const users = await User.find().select("_id name email admin createdAt updatedAt");
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Param middleware
const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    req.profile = user;
    next();
  } catch {
    res.status(400).json({ error: "Could not retrieve user" });
  }
};

// Read one
const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  res.json(req.profile);
};

// Update basic profile
const update = async (req, res) => {
  try {
    let user = req.profile;
    Object.assign(user, req.body);
    user.updatedAt = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Remove
const remove = async (req, res) => {
  try {
    const deleted = await req.profile.deleteOne();
    deleted.hashed_password = undefined;
    deleted.salt = undefined;
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Set admin flag
const setAdmin = async (req, res) => {
  try {
    const user = req.profile;
    user.admin = !!req.body.admin;
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({ message: "Role updated", user });
  } catch {
    res.status(400).json({ error: "Could not update role" });
  }
};

// Update security Q/A
const updateSecurity = async (req, res) => {
  try {
    const user = req.profile;
    const { securityQuestion, securityAnswerPlain } = req.body;
    if (!securityQuestion || !securityAnswerPlain) {
      return res.status(400).json({ error: "Security question and answer are required" });
    }
    user.securityQuestion = securityQuestion;
    user.securityAnswerPlain = securityAnswerPlain; // triggers virtual & hashing
    user.updatedAt = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({ message: "Security info updated", user });
  } catch {
    res.status(400).json({ error: "Could not update security question/answer" });
  }
};

// Update password
const updatePassword = async (req, res) => {
  try {
    const user = req.profile;
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    user.password = password; // virtual
    user.updatedAt = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({ message: "Password updated", user });
  } catch {
    res.status(400).json({ error: "Could not update password" });
  }
};

export default {
  create,
  list,
  userByID,
  read,
  update,
  remove,
  setAdmin,
  updateSecurity,
  updatePassword,
};
