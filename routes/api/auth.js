const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

const router = express.Router();

const User = require("../../models/user");

const { createError } = require("../../helpers/");

const emailRegexp = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

const userRegisterSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

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
    const result = await User.create({ email, password: hashPassword });
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

    const token = "!asfasfas.sfafas.afsasgh";
    res.json({
      token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
