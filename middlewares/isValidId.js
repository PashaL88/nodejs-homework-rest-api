const { isValidObjectId } = require("mongoose");

const { createError } = require("../helpers");

const isValidId = (req, _, next) => {
  const { id } = req.params;
  const verify = isValidObjectId(id);
  if (!verify) {
    next(createError(400, `${id} is not verifed`));
  }
  next();
};

module.exports = isValidId;
