const getAll = require("../controllers/Ajustement.controller.js").getAll;
const getAjustementDetails =
  require("../controllers/Ajustement.controller.js").getAjustementDetails;
const getSpecific =
  require("../controllers/Ajustement.controller.js").getSpecific;
const createOne = require("../controllers/Ajustement.controller.js").createOne;
const express = require("express");
const Autentification = require("../middlewares/Authentification.middleware.js");
const AjustementRouter = express.Router();
AjustementRouter.get("/Ajustement/", Autentification, getAll);
AjustementRouter.get(
  "/AjustementDetails/:ajustement_id",
  Autentification,
  getAjustementDetails
);
AjustementRouter.get("/Ajustement/:id", Autentification, getSpecific);
AjustementRouter.post("/Ajustement/", Autentification, createOne);
module.exports = AjustementRouter;
