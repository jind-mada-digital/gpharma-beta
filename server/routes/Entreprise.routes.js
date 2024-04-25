const getSpecific =
  require("../controllers/Entreprise.controller.js").getSpecific;
const createOne = require("../controllers/Entreprise.controller.js").createOne;
const updateOne = require("../controllers/Entreprise.controller.js").updateOne;
const express = require("express");
const Autentification = require("../middlewares/Authentification.middleware.js");
const EntrepriseRouter = express.Router();
EntrepriseRouter.get("/Entreprise/:id", Autentification, getSpecific);
EntrepriseRouter.post("/Entreprise/", Autentification, createOne);
EntrepriseRouter.put("/Entreprise/:id", Autentification, updateOne);
module.exports = EntrepriseRouter;
