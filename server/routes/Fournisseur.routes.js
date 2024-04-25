const getAll = require("../controllers/Fournisseur.controller.js").getAll;
const getSpecific =
  require("../controllers/Fournisseur.controller.js").getSpecific;
const createOne = require("../controllers/Fournisseur.controller.js").createOne;
const updateOne = require("../controllers/Fournisseur.controller.js").updateOne;
const getActivityFournisseur =
  require("../controllers/Fournisseur.controller.js").getActivityFournisseur;
const deleteOne = require("../controllers/Fournisseur.controller.js").deleteOne;
const express = require("express");
const Autentification = require("../middlewares/Authentification.middleware.js");
const FournisseurRouter = express.Router();
FournisseurRouter.get("/Fournisseur/", Autentification, getAll);
FournisseurRouter.get(
  "/activityFournisseur/",
  Autentification,
  getActivityFournisseur
);
FournisseurRouter.get("/Fournisseur/:id", Autentification, getSpecific);
FournisseurRouter.post("/Fournisseur/", Autentification, createOne);
FournisseurRouter.put("/Fournisseur/:id", Autentification, updateOne);
FournisseurRouter.delete("/Fournisseur/:id", Autentification, deleteOne);
module.exports = FournisseurRouter;
