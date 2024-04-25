const express = require("express");
const gerneratePdf =
  require("../controllers/Download.controller.js").gerneratePdf;
const Autentification = require("../middlewares/Authentification.middleware.js");
const DownloadRouter = express.Router();

DownloadRouter.get("/download/pdf/vente/:id", Autentification, gerneratePdf);

module.exports = DownloadRouter;
