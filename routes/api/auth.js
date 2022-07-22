const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");

const router = express.Router();

const User = require("../../models/user");

const { createError } = require("../../helpers/");

const { authorize, upload } = require("../../middlewares");

const emailRegexp = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

const userRegisterSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const { SECRET_KEY } = process.env;

router.post("/signup", async (req, res, next) => {
  try {
    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
      throw createError(400, "Ошибка от Joi или другой библиотеки валидации");
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw createError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarUrl = gravatar.url(email);
    const result = await User.create({
      email,
      password: hashPassword,
      avatarUrl,
    });
    res.status(201).json({
      email: result.email,
      subscription: result.subscription,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
      throw createError(400);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(401, "Email wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw createError(401, "Password wrong");
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/logout", authorize, async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.json({
      message: "Logout succes",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/current", authorize, async (req, res) => {
  const { subscription, email } = req.user;
  res.json({
    subscription,
    email,
  });
});

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

router.patch(
  "/avatars",
  authorize,
  upload.single("Avatar"),
  async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { path: tempDir, originalname } = req.file;
      const [extention] = originalname.split(".").reverse();
      const newAvatar = path.join(`${_id}.${extention}`);
      const uploadDir = path.join(avatarsDir, newAvatar);
      await fs.rename(tempDir, uploadDir);
      const avatarURL = path.join("avatars", newAvatar);
      await User.findByIdAndUpdate(req.user._id, { avatarURL });
      res.json({ avatarURL });
    } catch (error) {
      await fs.unlink(req.file.path);
      next(error);
    }
  }
);

module.exports = router;
