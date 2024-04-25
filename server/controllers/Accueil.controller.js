const Op = require("sequelize").Op;
const QueryTypes = require("sequelize").QueryTypes;
const db = require("../config/Database.js");
const Utilisateur = require("../database/models/Utilisateur.model.js");
const Vente = require("../database/models/Vente.model.js");
const getDateNow = require("../utils/utils.js").getDateNow;
const getStatGeneral = async (req, res) => {
  const user = await Utilisateur.findOne({ id: req.params.utilisateur_id });
  if (!user)
    return res.status(404).send({ message: "Utilisateur introvable!" });
  try {
    let query = `SELECT  (    SELECT COUNT(*)  FROM ravitaillement WHERE deletedAt IS NULL AND etat_ravitaillement = "COMMANDE")  AS count_commande
      ,(    SELECT COUNT(*)  FROM   ravitaillement WHERE deletedAt IS NULL AND etat_ravitaillement != "COMMANDE") AS count_livraison
      ,(    SELECT COUNT(*)  FROM   vente WHERE deletedAt IS NULL AND etat_vente = "0") AS count_guichet
      ,(    SELECT COUNT(*)  FROM   vente  WHERE deletedAt IS NULL AND etat_vente != "0") AS count_caisse 
      ,(    SELECT COUNT(*)  FROM   ravitaillement  WHERE deletedAt IS NULL) AS count_rvt_total
      ,(    SELECT COUNT(*)  FROM   vente  WHERE deletedAt IS NULL) AS count_vente_total`;
    if (user.type_utilisateur == "CAISSIER")
      query = `SELECT  (    SELECT COUNT(*)  FROM ravitaillement WHERE deletedAt IS NULL AND etat_ravitaillement = "COMMANDE")  AS count_commande
      ,(    SELECT COUNT(*)  FROM   ravitaillement WHERE deletedAt IS NULL AND etat_ravitaillement != "COMMANDE") AS count_livraison
      ,(    SELECT COUNT(*)  FROM   vente WHERE deletedAt IS NULL AND etat_vente = "0" AND caissier_id == '${user.type_utilisateur}') AS count_guichet
      ,(    SELECT COUNT(*)  FROM   vente  WHERE deletedAt IS NULL AND etat_vente != "0" AND caissier_id == '${user.type_utilisateur}') AS count_caisse 
      ,(    SELECT COUNT(*)  FROM   ravitaillement  WHERE deletedAt IS NULL) AS count_rvt_total
      ,(    SELECT COUNT(*)  FROM   vente  WHERE deletedAt IS NULL AND caissier_id == '${user.type_utilisateur}') AS count_vente_total`;
    if (user.type_utilisateur == "GUICHETIER")
      query = `SELECT  (    SELECT COUNT(*)  FROM ravitaillement WHERE deletedAt IS NULL AND etat_ravitaillement = "COMMANDE")  AS count_commande
      ,(    SELECT COUNT(*)  FROM   ravitaillement WHERE deletedAt IS NULL AND etat_ravitaillement != "COMMANDE") AS count_livraison
      ,(    SELECT COUNT(*)  FROM   vente WHERE deletedAt IS NULL AND etat_vente = "0" AND guichetier_id == '${user.type_utilisateur}') AS count_guichet
      ,(    SELECT COUNT(*)  FROM   vente  WHERE deletedAt IS NULL AND etat_vente != "0" AND guichetier_id == '${user.type_utilisateur}') AS count_caisse 
      ,(    SELECT COUNT(*)  FROM   ravitaillement  WHERE deletedAt IS NULL) AS count_rvt_total
      ,(    SELECT COUNT(*)  FROM   vente  WHERE deletedAt IS NULL AND guichetier_id == '${user.type_utilisateur}') AS count_vente_total`;
    const count = await db.query(query, { type: QueryTypes.SELECT });
    res.status(200).send(count);
  } catch (error) {
    console.log(error.message);
  }
};
/* const getStatVente = async (req, res) => {
  console.log(`%${req.params.mode}%`);
  try {
    const item_vente = await Vente.findOne({
      attributes: ["date_vente"],
      where: { etat_vente: "1" },
      order: [["createdAt", "ASC"]],
    });
    if (!item_vente) {
      return res.status(404).json({
        message: "Aucune vente!",
      });
    }
    let dayStart = 1;
    let arrayDay = [];
    let select = "SELECT";
    for (let i = dayStart; i <= parseInt(getDateNow().slice(8, 10)); i++) {
      select += `(SELECT COUNT(date_vente)  FROM   vente  WHERE deletedAt IS NULL AND date_vente LIKE "%${getDateNow().slice(
        0,
        7
      )}-${i.toString().length == 1 ? "0" + i : i}%") AS count_${i} ,`;
      arrayDay.push(i);
    }
    select = select.slice(0, -1);
    const count = await db.query(select, { type: QueryTypes.SELECT });
    let temp = [];
    for (let index = dayStart; index <= arrayDay.length; index++) {
      temp.push(count[0]["count_" + index]);
    }
    res.status(200).send([arrayDay, temp]);
  } catch (error) {
    console.log(error.message);
  }
}; */
const getStatVente = async (req, res) => {
  const getSelectQuery = (mode, date, colQuery, addCond = "") => {
    const two_lenght = (val) => (val.toString().length == 1 ? "0" + val : val);

    let month = two_lenght(parseInt(new Date(date).getUTCMonth()) + 1);
    const day = parseInt(new Date(date).getUTCDate());
    const year = parseInt(new Date(date).getFullYear());
    month = month.toString().length == 1 ? "0" + month : month;
    let select = "SELECT ";
    if (mode == 0) {
      for (let index = 0; index < 24; index++) {
        const min = date + " " + two_lenght(parseInt(index)) + ":00:00";
        const max = date + " " + two_lenght(parseInt(index)) + ":59:59";
        select += `(SELECT ${colQuery}  FROM  vente  A ${addCond}  WHERE A.deletedAt IS NULL AND date_vente BETWEEN '${new Date(
          min
        ).toISOString()}' AND '${new Date(
          max
        ).toISOString()}') as '${index}H',`;
      }
    } else {
      function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
      }
      const check = month == new Date().getUTCMonth() + 1;
      let __max =
        mode == 1
          ? day >= 7
            ? 7
            : day
          : day >= 31
          ? 31
          : check
          ? day
          : daysInMonth(month, year);

      for (let index = __max; index >= 1; index--) {
        const order = __max - index;
        let min =
          year +
          "-" +
          month +
          "-" +
          two_lenght(parseInt(parseInt(day) - index + 1)) +
          " 00:00:00";
        let max =
          year +
          "-" +
          month +
          "-" +
          two_lenght(parseInt(parseInt(day) - index + 1)) +
          " 23:59:59";
        if (!check && __max == daysInMonth(month, year)) {
          min = year + "-" + month + "-" + two_lenght(index) + " 00:00:00";
          max = year + "-" + month + "-" + two_lenght(index) + " 23:59:59";
        }
        select += `(SELECT ${colQuery} FROM vente A ${addCond} WHERE A.deletedAt IS NULL AND date_vente BETWEEN '${new Date(
          min
        ).toISOString()}' AND '${new Date(max).toISOString()}') as '${
          __max == 7
            ? two_lenght(parseInt(parseInt(day) - index + 1))
            : order + 1
        }',`;
      }
    }
    select = select.substring(0, select.length - 1);
    return select;
  };
  try {
    const data1 = await db.query(
      getSelectQuery(req.params.mode, req.params.date, "SUM(montant_total)"),
      QueryTypes.SELECT
    );
    const data2 = await db.query(
      getSelectQuery(req.params.mode, req.params.date, "COUNT(date_vente)"),
      QueryTypes.SELECT
    );
    const data3 = await db.query(
      getSelectQuery(
        req.params.mode,
        req.params.date,
        " SUM(montant_total-(prix_stock * B.quantite_vendue)) ",
        "  LEFT JOIN `vente_detail` B ON A.id = B.vente_id LEFT JOIN produit C ON B.produit_code_lot_produit = C.code_lot_produit "
      ),
      QueryTypes.SELECT
    );
    res.status(200).send([data1[0][0], data2[0][0], data3[0][0]]);
  } catch (error) {
    console.log(error.message);
  }
};
const getStatPersonnel = async (req, res) => {
  try {
    const data1 = await db.query(
      `SELECT 
    ( SELECT COUNT(*)  FROM utilisateur WHERE deletedAt IS NULL AND type_utilisateur = "ADMIN") as count_admin,
    ( SELECT COUNT(*)  FROM utilisateur WHERE deletedAt IS NULL AND type_utilisateur = "GUICHETIER") as count_guichetier,
    ( SELECT COUNT(*)  FROM utilisateur WHERE deletedAt IS NULL AND type_utilisateur = "CAISSIER") as count_caissier
    `,
      QueryTypes.SELECT
    );
    const data2 = await db.query(
      `SELECT  (    SELECT COUNT(*)  FROM ravitaillement WHERE deletedAt IS NULL AND etat_ravitaillement = "COMMANDE" ${
        req.params.utilisateur_id !== undefined
          ? " AND utilisateur_id = '" + req.params.utilisateur_id + "'"
          : ""
      } )  AS count_commande
      ,(    SELECT COUNT(*)  FROM   ravitaillement WHERE deletedAt IS NULL AND etat_ravitaillement != "COMMANDE" ${
        req.params.utilisateur_id !== undefined
          ? " AND utilisateur_id = '" + req.params.utilisateur_id + "'"
          : ""
      }) AS count_livraison
      ,(    SELECT COUNT(*)  FROM   vente WHERE deletedAt IS NULL AND etat_vente = "0" ${
        req.params.utilisateur_id !== undefined
          ? " AND guichetier_id = '" + req.params.utilisateur_id + "'"
          : ""
      }) AS count_guichet
      ,(    SELECT COUNT(*)  FROM   vente  WHERE deletedAt IS NULL AND etat_vente != "0" ${
        req.params.utilisateur_id !== undefined
          ? " AND caissier_id = '" + req.params.utilisateur_id + "'"
          : ""
      }) AS count_caisse  
    `,
      QueryTypes.SELECT
    );

    res.status(200).send([data1[0], data2[0]]);
  } catch (error) {
    console.log(error.message);
  }
};
const getStatStock = async (req, res) => {
  // const getMinMax = (mode, date) => {
  //   return { min, max };
  // };
  // const { min, max } = getMinMax(req.params.mode, req.params.date);
  try {
    const data = await db.query(
      `SELECT 
      ( SELECT SUM(B.quantite_produit) FROM produit A LEFT JOIN produit_emplacement B ON (A.code_lot_produit = B.produit_code_lot_produit) WHERE deletedAt IS NULL AND date_peremption > NOW() AND B.emplacement_id = 2 AND A.quantite_stock > 0 AND B.quantite_produit > 0) as count_etale,
      ( SELECT SUM(B.quantite_produit) FROM produit A LEFT JOIN produit_emplacement B ON (A.code_lot_produit = B.produit_code_lot_produit) WHERE deletedAt IS NULL AND date_peremption > NOW() AND B.emplacement_id = 1 AND A.quantite_stock > 0 AND B.quantite_produit > 0) as count_stock,
      ( SELECT MIN(A.quantite_stock) FROM produit A LEFT JOIN produit_emplacement B ON (A.code_lot_produit = B.produit_code_lot_produit) WHERE deletedAt IS NULL AND date_peremption > NOW()  AND A.quantite_stock > 0 ) as count_min,
      ( SELECT Max(A.quantite_stock) FROM produit A LEFT JOIN produit_emplacement B ON (A.code_lot_produit = B.produit_code_lot_produit) WHERE deletedAt IS NULL AND date_peremption > NOW()  AND A.quantite_stock > 0 ) as count_max,
      ( SELECT SUM(A.quantite_stock) FROM produit A WHERE deletedAt IS NULL AND date_peremption <= NOW() AND A.quantite_stock > 0) as count_perime;
    `,
      QueryTypes.SELECT
    );

    res.status(200).send(data[0]);
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  getStatGeneral,
  getStatVente,
  getStatPersonnel,
  getStatStock,
};
