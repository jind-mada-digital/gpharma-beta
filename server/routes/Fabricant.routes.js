const getAll = require("../controllers/Fabricant.controller.js").getAll;
const getSpecific =
  require("../controllers/Fabricant.controller.js").getSpecific;
const createOne = require("../controllers/Fabricant.controller.js").createOne;
const updateOne = require("../controllers/Fabricant.controller.js").updateOne;
const deleteOne = require("../controllers/Fabricant.controller.js").deleteOne;
const express = require("express");
const Autentification = require("../middlewares/Authentification.middleware.js");
const FabricantRouter = express.Router();
FabricantRouter.get("/Fabricant/", Autentification, getAll);
FabricantRouter.get("/Fabricant/:id", Autentification, getSpecific);
FabricantRouter.post("/Fabricant/", Autentification, createOne);
FabricantRouter.put("/Fabricant/:id", Autentification, updateOne);
FabricantRouter.delete("/Fabricant/:id", Autentification, deleteOne);
module.exports = FabricantRouter;
