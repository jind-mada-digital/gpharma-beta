const express = require("express");
const Router = express.Router();
//const Authentification = require("../../../middlewares/Authentification.middleware.js");
const venteController = require('../controllers/venteController.js');

// Define the route for importing products from an Excel file
Router.get('/ventes', venteController.lists);

Router.get('/ventes/best-seller', venteController.bestSeller);

module.exports = Router;