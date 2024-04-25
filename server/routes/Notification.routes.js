const getAllNotification =
  require("../controllers/Notification.controller.js").getAllNotification;
const getAllNewNotification =
  require("../controllers/Notification.controller.js").getAllNewNotification;
const getSpecific =
  require("../controllers/Notification.controller.js").getSpecific;
const updateOne =
  require("../controllers/Notification.controller.js").updateOne;
const deleteOne =
  require("../controllers/Notification.controller.js").deleteOne;
const express = require("express");
const Autentification = require("../middlewares/Authentification.middleware.js");
const NotificationRouter = express.Router();
NotificationRouter.get(
  "/getAllNotification/:utilisateur_id",
  Autentification,
  getAllNotification
);
NotificationRouter.get(
  "/getAllNewNotification/:utilisateur_id",
  Autentification,
  getAllNewNotification
);
NotificationRouter.get("/Notification/:id", Autentification, getSpecific);
// NotificationRouter.post("/Notification/", Autentification, createOne);
NotificationRouter.put("/Notification/:id", Autentification, updateOne);
NotificationRouter.delete("/Notification/:id", Autentification, deleteOne);
module.exports = NotificationRouter;
