const getAll = require("../controllers/Produit.controller.js").getAll;
const getAllEtalage =
  require("../controllers/Produit.controller.js").getAllEtalage;
const getSpecific = require("../controllers/Produit.controller.js").getSpecific;
const createOne = require("../controllers/Produit.controller.js").createOne;
const updateOne = require("../controllers/Produit.controller.js").updateOne;
const deleteOne = require("../controllers/Produit.controller.js").deleteOne;
const updateEtalage =
  require("../controllers/Produit.controller.js").updateEtalage;
const updateStatus =
  require("../controllers/Produit.controller.js").updateStatus;
const getSelectEtalage =
  require("../controllers/Produit.controller.js").getSelectEtalage;
const express = require("express");
const Autentification = require("../middlewares/Authentification.middleware.js");
const ProduitRouter = express.Router();
ProduitRouter.get("/Produit/", Autentification, getAll);
ProduitRouter.get("/produitEtalage/", Autentification, getAllEtalage);
ProduitRouter.get("/produitSelectEtalage/", Autentification, getSelectEtalage);
ProduitRouter.get("/Produit/:code_lot_produit", Autentification, getSpecific);
ProduitRouter.post("/Produit/", Autentification, createOne);
ProduitRouter.put("/Produit/:code_lot_produit", Autentification, updateOne);
ProduitRouter.put("/etalage/:code_lot_produit", Autentification, updateEtalage);
ProduitRouter.put(
  "/Produit/status/:code_lot_produit",
  Autentification,
  updateStatus
);
ProduitRouter.delete("/Produit/:code_lot_produit", Autentification, deleteOne);
module.exports = ProduitRouter;
