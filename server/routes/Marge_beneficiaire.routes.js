const getAll =
  require("../controllers/Marge_beneficiaire.controller.js").getAll;
const getSpecific =
  require("../controllers/Marge_beneficiaire.controller.js").getSpecific;
const createOne =
  require("../controllers/Marge_beneficiaire.controller.js").createOne;
const updateOne =
  require("../controllers/Marge_beneficiaire.controller.js").updateOne;
const updateActive =
  require("../controllers/Marge_beneficiaire.controller.js").updateActive;
const updateStatus =
  require("../controllers/Marge_beneficiaire.controller.js").updateStatus;
const deleteOne =
  require("../controllers/Marge_beneficiaire.controller.js").deleteOne;
const getActive =
  require("../controllers/Marge_beneficiaire.controller.js").getActive;
const express = require("express");
const Autentification = require("../middlewares/Authentification.middleware.js");
const Marge_beneficiaireRouter = express.Router();
Marge_beneficiaireRouter.get("/Marge_beneficiaire/", Autentification, getAll);
Marge_beneficiaireRouter.get(
  "/Marge_beneficiaire/active",
  Autentification,
  getActive
);
Marge_beneficiaireRouter.get(
  "/Marge_beneficiaire/:id",
  Autentification,
  getSpecific
);
Marge_beneficiaireRouter.post(
  "/Marge_beneficiaire/",
  Autentification,
  createOne
);
Marge_beneficiaireRouter.put(
  "/Marge_beneficiaire/:id",
  Autentification,
  updateOne
);
Marge_beneficiaireRouter.put(
  "/Marge_beneficiaire/active/:id",
  Autentification,
  updateActive
);
Marge_beneficiaireRouter.put(
  "/marge_beneficiaireStatus/:id",
  Autentification,
  updateStatus
);
Marge_beneficiaireRouter.delete(
  "/Marge_beneficiaire/:id",
  Autentification,
  deleteOne
);
module.exports = Marge_beneficiaireRouter;
