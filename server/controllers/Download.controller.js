const capitalizeFirstLetter =
  require("../utils/utils.js").capitalizeFirstLetter;
const getDateNow = require("../utils/utils.js").getDateNow;
const getDateTime = require("../utils/utils.js").getDateTime;
const numberWithCommas = require("../utils/utils.js").numberWithCommas;
const fs = require("fs");
const path = require("path");
const dirname = require("path").dirname;
const pdf = require("pdf-creator-node");
const fileURLToPath = require("url").fileURLToPath;
const Caisse = require("../database/models/Caisse.model.js");
const Client = require("../database/models/Client.model.js");
const Entreprise = require("../database/models/Entreprise.model.js");
const Guichet = require("../database/models/Guichet.model.js");
const Ordonnance = require("../database/models/Ordonnance.model.js");
const Produit = require("../database/models/Produit.model.js");
const Societe = require("../database/models/Societe.model.js");
const Unite = require("../database/models/Unite.model.js");
const Vente = require("../database/models/Vente.model.js");
const Vente_detail = require("../database/models/Vente_detail.model.js");
const NumberToLetter =
  require("../utils/number-to-letter/index.js").NumberToLetter;
const options = require("../utils/pdf-creator-node/options.js");

const gerneratePdf = async (req, res) => {
  const id_vente = req.params.id;
  const a = await Vente_detail.findAll({
    where: { vente_id: id_vente },
    include: [{ model: Unite }, { model: Produit }],
  });
  console.log(a);
  const html = fs.readFileSync(
    path.join(__dirname, "../templates/pdf/vente.facture.html"),
    "utf-8"
  );
  const filename = `FACTURE_${id_vente}_${getDateTime()}.pdf`;
  await Entreprise.findOne({ where: { id: "GPHARMA_0001" } })
    .then(async (pharmacie) => {
      // if (!pharmacie)
      //   return res.status(404).send({ message: "Une erreur est survénue!" });
      await Vente.findOne({
        where: { id: id_vente },
        include: [
          { model: Client },
          { model: Guichet },
          { model: Ordonnance },
          { model: Caisse },
          { model: Societe },
        ],
      })
        .then(async (_vente) => {
          await Vente_detail.findAll({
            where: { vente_id: id_vente },
            include: [{ model: Unite }, { model: Produit }],
          }).then(async (_venteDetails) => {
            if (
              _venteDetails.length > 0 &&
              pharmacie.dataValues &&
              _vente.dataValues
            ) {
              const document = {
                html,
                data: {
                  pharmacie: pharmacie.dataValues,
                  vente: {
                    ..._vente.dataValues,
                    ["montant_total"]: numberWithCommas(
                      _vente.dataValues.montant_total
                    ),
                    ["client"]: _vente.client?.dataValues,
                    ["ordonnance"]: _vente.ordonnance?.dataValues,
                    ["societe"]: _vente.societe?.dataValues,
                    ["guichet"]: _vente.guichet?.dataValues,
                    ["caisse"]: _vente.caisse?.dataValues,
                    ["date_vente"]:
                      new Date(_vente.dataValues.date_vente).getFullYear() +
                      "-" +
                      (parseInt(
                        new Date(_vente.dataValues.date_vente).getMonth()
                      ) +
                        1) +
                      "-" +
                      new Date(_vente.dataValues.date_vente).getDate(),
                    ["date_facture"]: getDateNow("date"),
                    ["societe_prise_en_charge_f"]: _vente.dataValues
                      .societe_prise_en_charge
                      ? _vente.dataValues.societe_prise_en_charge + " %"
                      : "",
                    ["montant_total_en_lettre"]: capitalizeFirstLetter(
                      NumberToLetter(
                        Math.round(_vente.dataValues.montant_total)
                      )
                    ),
                  },
                  vente_detail: _venteDetails.map(
                    (element) =>
                      (element = {
                        ...element.dataValues,
                        ["prix_vente"]: numberWithCommas(
                          Math.round(element.montant_vente)
                        ),
                        ["quantite_vendue"]: numberWithCommas(
                          element.quantite_vendue
                        ),
                        ["montant_vente"]: numberWithCommas(
                          Math.round(element.montant_vente)
                        ),
                        ["societe_prise_en_charge_f"]: _vente.dataValues
                          .societe_prise_en_charge
                          ? _vente.dataValues.societe_prise_en_charge + " %"
                          : "",
                        ["produit"]: element.produit.dataValues,
                        ["unite"]: element.unite.dataValues,
                      })
                  ),
                },
                path: "./public/pdf/vente/facture/" + filename,
              };
              // return res.json(document);
              await pdf
                .create(document, options)
                .then((response) => {
                  return res.status(200).json({ url: filename });
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = { gerneratePdf };
