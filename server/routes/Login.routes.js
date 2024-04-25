const express = require("express");
const login = require("../controllers/Login.controller.js").login;
const logout = require("../controllers/Login.controller.js").logout;
const reloadDataUser =
  require("../controllers/Login.controller.js").reloadDataUser;
const Authentification = require("../middlewares/Authentification.middleware.js");
const LoginRouter = express.Router();
LoginRouter.post("/login/", login);
LoginRouter.get("/logout/:id", Authentification, logout);
LoginRouter.get("/reloadDataUser/:id", Authentification, reloadDataUser);
module.exports = LoginRouter;
