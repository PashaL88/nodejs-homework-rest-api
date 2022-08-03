const express = require("express");

const { authorize } = require("../../middlewares");

const ctrl = require("../../controllers/contacts");

const router = express.Router();

router.get("/", authorize, ctrl.getAll);

router.get("/:id", authorize, ctrl.getById);

router.post("/", authorize, ctrl.add);

router.delete("/:id", ctrl.deleteById);

router.put("/:id", ctrl.updateById);

router.patch("/:id/favorite", ctrl.updateFavorite);

module.exports = router;
