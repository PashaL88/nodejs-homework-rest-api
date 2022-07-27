const express = require("express");
const logger = require("morgan");
const cors = require("cors");

// const fs = require("fs");

const dotenv = require("dotenv");
dotenv.config();

const authRouter = require("./routes/api/auth");
const contactsRouter = require("./routes/api/contacts");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// app.post("/api/avatars", upload.single("image"), (res, req) => {
//   console.log(req.body);
//   console.log(req.file);
// });

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);


const formatsLogger = app.get("env") === "development" ? "dev" : "short";


app.use(logger(formatsLogger));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((error, req, res, next) => {
  const { status = 500, message = "Server error" } = error;
  res.status(status).json({ message });
});

module.exports = app;
