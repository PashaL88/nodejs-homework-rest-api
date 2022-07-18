const { Schema, model } = require("mongoose");

const userSchema = Schema({}, { versionKey: false, timestamps: true });

const User = model("user", userSchema);

module.exports = User;
