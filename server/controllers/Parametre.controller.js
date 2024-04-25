const QueryTypes = require("sequelize").QueryTypes;
const db = require("../config/Database.js");

const getCount = async (req, res) => {
  try {
    const count = await db.query(
      `SELECT  (    SELECT COUNT(*)  FROM   forme WHERE deletedAt IS NULL)  AS count_forme 
      ,(    SELECT COUNT(*)  FROM   caisse WHERE deletedAt IS NULL) AS count_caisse
      ,(    SELECT COUNT(*)  FROM   emplacement WHERE deletedAt IS NULL) AS count_emplacement
      ,(    SELECT COUNT(*)  FROM   fabricant  WHERE deletedAt IS NULL) AS count_fabricant
      ,(    SELECT COUNT(*)  FROM   famille  WHERE deletedAt IS NULL) AS count_famille 
      ,(    SELECT COUNT(*)  FROM   forme  WHERE deletedAt IS NULL) AS count_forme 
      ,(    SELECT COUNT(*)  FROM   mode_expedition  WHERE deletedAt IS NULL) AS count_mode_expedition
      ,(    SELECT COUNT(*)  FROM   unite  WHERE deletedAt IS NULL) AS count_unite
      ,(    SELECT COUNT(*)  FROM   societe  WHERE deletedAt IS NULL) AS count_societe
      ,(    SELECT COUNT(*)  FROM   guichet  WHERE deletedAt IS NULL) AS count_guichet
      ,(    SELECT COUNT(*)  FROM   voie  WHERE deletedAt IS NULL) AS count_voie`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).send(count);
  } catch (error) {
    res.status(422).send({ message: error.message });
  }
};
const updateOne = async (req, res) => {};

module.exports = { getCount };
