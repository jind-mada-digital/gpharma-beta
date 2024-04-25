const Notification = require("../database/models/Notification.model.js");
let cron = require("node-cron");
const { getDateNow } = require("../utils/utils.js");
const {
  convertEngDayMonth,
} = require("../utils/nizwami-ibrahim/ConvertEngDayMonth.js");
const Notification_utilisateur = require("../database/models/Notification_utilisateur.model.js");
const { Op, QueryTypes, col } = require("sequelize");
const db = require("../config/Database.js");
const { socketIO } = require("../utils/utils.js");
const Utilisateur = require("../database/models/Utilisateur.model.js");
const getAllNewNotification = async (req, res) => {
  try {
    const job = cron.schedule("*/50 * * * * *", async () => {
      console.log(getDateNow()); //utilisateur_id
      const response = await db.query(
        `
      SELECT A.id, A.label, A.details, A.importance, A.icon, DATE_FORMAT(createdAt, ' %W %d %M %Y ') AS createdAt FROM notification A INNER JOIN notification_utilisateur B ON (A.id = B.notification_id AND B.etat = "NOUVELLE" ) WHERE A.deletedAt IS NULL ORDER BY createdAt DESC; 
      `,
        { type: QueryTypes.SELECT }
      );
      if (response.length > 0) {
        let resp = [];
        response.map((element) => {
          element = {
            ...element,
            ["createdAt"]: convertEngDayMonth(element.createdAt),
          };
          resp.push(element);
        });
        res.json(resp);
        job.destroy();
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};
const query = `
SELECT A.id, B.id AS notification_utilisateur_id, A.label, A.details, A.importance, A.icon, B.etat, B.utilisateur_id, DATE_FORMAT(createdAt, ' %W %d %M %Y ') AS createdAt FROM notification A INNER JOIN notification_utilisateur B ON (A.id = B.notification_id  AND B.etat != "SUPPRIME" ) WHERE A.deletedAt IS NULL ORDER BY A.id DESC; 
`;
const getAllNotification = async (req, res) => {
  try {
    const response = await db.query(
      `
      SELECT A.id, A.label, A.details, A.importance, A.icon, B.etat, DATE_FORMAT(createdAt, ' %W %d %M %Y ') AS createdAt FROM notification A INNER JOIN notification_utilisateur B ON (A.id = B.notification_id  AND B.etat != "SUPPRIME" ) WHERE A.deletedAt IS NULL ORDER BY createdAt DESC; 
      `,
      { type: QueryTypes.SELECT }
    );
    if (response.length > 0) {
      let resp = [];
      response.map((element) => {
        element = {
          ...element,
          ["createdAt"]: convertEngDayMonth(element.createdAt),
        };
        resp.push(element);
      });
      res.json(resp);
    }
  } catch (error) {
    console.log(error.message);
  }
};
const getNotification = async () => {
  try {
    const response = await db.query(query, { type: QueryTypes.SELECT });
    if (response.length > 0) {
      let resp = [];
      response.map((element) => {
        element = {
          ...element,
          ["createdAt"]: convertEngDayMonth(element.createdAt),
        };
        resp.push(element);
      });

      socketIO.emit("newNotification", resp);
      return resp;
    }
  } catch (error) {
    console.log(error.message);
  }
};
const getSpecific = async (req, res) => {
  try {
    const response = await Notification.findOne({
      where: { id: req.params.id },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const createNewNotification = async (
  { label, details, importance, icon, type_utilisateur = "" },
  transaction = null
) => {
  const _notification = await Notification.create(
    {
      label,
      details,
      importance,
      icon,
    },
    { transaction }
  );
  const where = {};
  if (type_utilisateur) {
    where = { type_utilisateur };
  }
  const listAllUsers = await Utilisateur.findAll({ where });
  let _listAllUsers = [];
  if (listAllUsers.length > 0) {
    listAllUsers.forEach((user) => {
      _listAllUsers.push({
        etat: "NOUVELLE",
        utilisateur_id: user.id,
        notification_id: _notification.id,
      });
    });
    Notification_utilisateur.bulkCreate(_listAllUsers, { transaction }).then(
      async (respo) => {
        const response = await db.query(query, { type: QueryTypes.SELECT });
        if (response.length > 0) {
          let notifications = [];
          response.map((element) => {
            element = {
              ...element,
              ["createdAt"]: convertEngDayMonth(element.createdAt),
            };
            notifications.push(element);
          });
          console.log(notifications[0]);
          socketIO.emit("newNotification", notifications);
        }
      }
    );
  }
};

const updateOne = async (req, res) => {
  const _item = await Notification_utilisateur.findOne({
    where: { id: req.params.id },
  });
  if (!_item)
    return res.status(404).json({ message: "Notification introvable!" });

  try {
    _item.set({ etat: "VUE" });
    await _item.save();
    return res.status(200).json({ message: "Notification masquée comme vue." });
  } catch (error) {
    console.log(error);
  }
};
const deleteOne = async (req, res) => {
  console.log("\n\n\n\nfirst", req.params.id);
  const _item = await Notification_utilisateur.findOne({
    where: { id: req.params.id },
  });
  if (!_item)
    return res.status(404).json({ message: "Notification introvable!" });

  try {
    await Notification.destroy({ where: { id: _item.notification_id } });
    _item.set({ etat: "SUPPRIME" });
    await _item.save();
    return res
      .status(200)
      .json({ message: "Notification supprimée avec succès!" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getAllNotification,
  getNotification,
  getAllNewNotification,
  getSpecific,
  createNewNotification,
  updateOne,
  deleteOne,
};
