const getAll = require("../controllers/Emplacement.controller.js").getAll;
const getSpecific =
  require("../controllers/Emplacement.controller.js").getSpecific;
const createOne = require("../controllers/Emplacement.controller.js").createOne;
const updateOne = require("../controllers/Emplacement.controller.js").updateOne;
const deleteOne = require("../controllers/Emplacement.controller.js").deleteOne;
const express = require("express");
const Autentification = require("../middlewares/Authentification.middleware.js");
const EmplacementRouter = express.Router();
EmplacementRouter.get("/Emplacement/", Autentification, getAll);
EmplacementRouter.get("/Emplacement/:id", Autentification, getSpecific);
EmplacementRouter.post("/Emplacement/", Autentification, createOne);
EmplacementRouter.put("/Emplacement/:id", Autentification, updateOne);
EmplacementRouter.delete("/Emplacement/:id", Autentification, deleteOne);
module.exports = EmplacementRouter;
