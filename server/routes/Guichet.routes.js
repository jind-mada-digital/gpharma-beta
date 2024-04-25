const express = require("express");
const getAll = require("../controllers/Guichet.controller.js").getAll;
const getSpecific = require("../controllers/Guichet.controller.js").getSpecific;
const createOne = require("../controllers/Guichet.controller.js").createOne;
const updateOne = require("../controllers/Guichet.controller.js").updateOne;
const getGuichetActive =
  require("../controllers/Guichet.controller.js").getGuichetActive;
const deleteOne = require("../controllers/Guichet.controller.js").deleteOne;
const Autentification = require("../middlewares/Authentification.middleware.js");
const GuichetRouter = express.Router();
GuichetRouter.get("/Guichet/", Autentification, getAll);
GuichetRouter.get("/guichetActive/", Autentification, getGuichetActive);
GuichetRouter.get("/Guichet/:id", Autentification, getSpecific);
GuichetRouter.post("/Guichet/", Autentification, createOne);
GuichetRouter.put("/Guichet/:id", Autentification, updateOne);
GuichetRouter.delete("/Guichet/:id", Autentification, deleteOne);
module.exports = GuichetRouter;
