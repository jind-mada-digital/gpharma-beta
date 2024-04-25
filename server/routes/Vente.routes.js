const getAllGuichet =
  require("../controllers/Vente.controller.js").getAllGuichet;
const getAllCaisse = require("../controllers/Vente.controller.js").getAllCaisse;
const getSpecific = require("../controllers/Vente.controller.js").getSpecific;
const createOne = require("../controllers/Vente.controller.js").createOne;
const updateOne = require("../controllers/Vente.controller.js").updateOne;
const deleteOne = require("../controllers/Vente.controller.js").deleteOne;
const getGuichetNonLivrer =
  require("../controllers/Vente.controller.js").getGuichetNonLivrer;
const updateOneVenteDetail =
  require("../controllers/Vente.controller.js").updateOneVenteDetail;
const validateVenteCaisse =
  require("../controllers/Vente.controller.js").validateVenteCaisse;
const express = require("express");
const Autentification = require("../middlewares/Authentification.middleware.js");
const VenteRouter = express.Router();
VenteRouter.get(
  "/vente/myGuichet/:utilisateur_id",
  Autentification,
  getAllGuichet
);
VenteRouter.get(
  "/vente/myCaisse/:utilisateur_id",
  Autentification,
  getAllCaisse
);
VenteRouter.get(
  "/vente/GuichetNonLivrer",
  Autentification,
  getGuichetNonLivrer
);
VenteRouter.get("/vente/details/:id", Autentification, getSpecific);
VenteRouter.post("/vente/Guichet/", Autentification, createOne);
VenteRouter.put("/vente/Guichet/:id", Autentification, updateOne);
VenteRouter.put("/vente/caisse/:id", Autentification, validateVenteCaisse);
VenteRouter.put("/vente/details/:id", Autentification, updateOneVenteDetail);
VenteRouter.delete("/vente/Guichet/:id", Autentification, deleteOne);
module.exports = VenteRouter;
