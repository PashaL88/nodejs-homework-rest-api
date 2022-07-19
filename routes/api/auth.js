const express = require("express");
const Joi = require("joi");

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
    const result = await User.create({ email, password });
    res.status(201).json({ email: result.email });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
