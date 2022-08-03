const { Contact, schemas } = require("../../models/contact");
const { createError } = require("../../helpers/");

const add = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { error } = schemas.add.validate(req.body);
    if (error) {
      throw createError(400, "missing required name field");
    }

    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = add;
