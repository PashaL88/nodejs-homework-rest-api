const express = require("express");

const router = express.Router();

router.get("/", async (req, res, next) => {
  res.json({ message: "Home work 2" });
});

router.get("/:contactId", async (req, res, next) => {
  res.json({ message: "Home work 2" });
});

router.post("/", async (req, res, next) => {
  res.json({ message: "Home work 2" });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "Home work 2" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "Home work 2" });
});

module.exports = router;
