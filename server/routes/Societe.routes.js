const getAll = require("../controllers/Societe.controller.js").getAll;
const getSpecific = require("../controllers/Societe.controller.js").getSpecific;
const createOne = require("../controllers/Societe.controller.js").createOne;
const updateOne = require("../controllers/Societe.controller.js").updateOne;
const updateStatus =
  require("../controllers/Societe.controller.js").updateStatus;
const deleteOne = require("../controllers/Societe.controller.js").deleteOne;
const getAllActive =
  require("../controllers/Societe.controller.js").getAllActive;
const express = require("express");
const Autentification = require("../middlewares/Authentification.middleware.js");
const SocieteRouter = express.Router();
SocieteRouter.get("/Societe/", Autentification, getAll);
SocieteRouter.get("/SocieteActive/", Autentification, getAllActive);
SocieteRouter.get("/Societe/:id", Autentification, getSpecific);
SocieteRouter.post("/Societe/", Autentification, createOne);
SocieteRouter.put("/Societe/:id", Autentification, updateOne);
SocieteRouter.put("/SocieteStatus/:id", Autentification, updateStatus);
SocieteRouter.delete("/Societe/:id", Autentification, deleteOne);
module.exports = SocieteRouter;
