const { Contact } = require("../../models/contact");

const getAll = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const result = await Contact.find({ owner }).populate("owner", "email");
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = getAll;
