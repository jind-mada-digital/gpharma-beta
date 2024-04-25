const getAll = require("../controllers/Ravitaillement.controller.js").getAll;
const getSpecific =
  require("../controllers/Ravitaillement.controller.js").getSpecific;
const createOne =
  require("../controllers/Ravitaillement.controller.js").createOne;
const updateOne =
  require("../controllers/Ravitaillement.controller.js").updateOne;
const updateOneRavitaillementDetail =
  require("../controllers/Ravitaillement.controller.js").updateOneRavitaillementDetail;
const validateRavitaillement =
  require("../controllers/Ravitaillement.controller.js").validateRavitaillement;
const deleteOne =
  require("../controllers/Ravitaillement.controller.js").deleteOne;
const express = require("express");
const Autentification = require("../middlewares/Authentification.middleware.js");
const RavitaillementRouter = express.Router();
RavitaillementRouter.get("/Ravitaillement/", Autentification, getAll);
RavitaillementRouter.get("/Ravitaillement/:id", Autentification, getSpecific);
RavitaillementRouter.post("/Ravitaillement/", Autentification, createOne);
RavitaillementRouter.put("/Ravitaillement/:id", Autentification, updateOne);
RavitaillementRouter.put(
  "/updateOneRavitaillementDetail/:id",
  Autentification,
  updateOneRavitaillementDetail
);
RavitaillementRouter.put(
  "/validate_ravitaillement/:id",
  Autentification,
  validateRavitaillement
);
RavitaillementRouter.delete("/Ravitaillement/:id", Autentification, deleteOne);
module.exports = RavitaillementRouter;
