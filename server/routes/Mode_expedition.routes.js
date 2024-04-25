const getAll = require("../controllers/Mode_expedition.controller.js").getAll;
const getSpecific =
  require("../controllers/Mode_expedition.controller.js").getSpecific;
const createOne =
  require("../controllers/Mode_expedition.controller.js").createOne;
const updateOne =
  require("../controllers/Mode_expedition.controller.js").updateOne;
const deleteOne =
  require("../controllers/Mode_expedition.controller.js").deleteOne;
const express = require("express");
const Autentification = require("../middlewares/Authentification.middleware.js");
const Mode_expeditionRouter = express.Router();
Mode_expeditionRouter.get("/Mode_expedition/", Autentification, getAll);
Mode_expeditionRouter.get("/Mode_expedition/:id", Autentification, getSpecific);
Mode_expeditionRouter.post("/Mode_expedition/", Autentification, createOne);
Mode_expeditionRouter.put("/Mode_expedition/:id", Autentification, updateOne);
Mode_expeditionRouter.delete(
  "/Mode_expedition/:id",
  Autentification,
  deleteOne
);
module.exports = Mode_expeditionRouter;
