const getStatGeneral =
  require("../controllers/Accueil.controller.js").getStatGeneral;
const getStatVente =
  require("../controllers/Accueil.controller.js").getStatVente;
const express = require("express");
const {
  getStatPersonnel,
  getStatStock,
} = require("../controllers/Accueil.controller.js");
const Autentification = require("../middlewares/Authentification.middleware.js");
const AccueilRouter = express.Router();
AccueilRouter.get(
  "/Accueil/StatGeneral/:utilisateur_id",
  Autentification,
  getStatGeneral
);
AccueilRouter.get(
  "/Accueil/StatVente/:mode/:date",
  Autentification,
  getStatVente
);
AccueilRouter.get("/Accueil/StatStock", Autentification, getStatStock);
AccueilRouter.get(
  "/Accueil/StatPersonnel/:mode/:date/:utilisateur_id",
  Autentification,
  getStatPersonnel
);
module.exports = AccueilRouter;
