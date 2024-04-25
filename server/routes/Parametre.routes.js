const express = require("express");
const getCount = require("../controllers/Parametre.controller.js").getCount;
const Autentification = require("../middlewares/Authentification.middleware.js");
const ParametreRouter = express.Router();

ParametreRouter.get("/parametre/count", Autentification, getCount);

module.exports = ParametreRouter;
