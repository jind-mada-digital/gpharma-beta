import React, { useEffect, useState } from "react";
import {
  addData,
  ButtonTable,
  confirmDelete,
  convertToOption,
  filterOption,
  getData,
  getDateNow,
  getUrl,
  InputForm,
  numberWithCommas,
  onChange,
  SelectForm,
  updateData,
  verifObligatory,
} from "../../../utils/utils";
import { intializeVenteSelected, isAddState } from "../../../atoms/caisse";
import { faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { element } from "prop-types";

function Insert() {
  const [isAdd, setIsAdd] = useRecoilState(isAddState);
  const [listUnite, setListUnite] = useState([]);
  const [edit_item, setEdit_item] = useState({
    code_lot_produit: "",
    vente_id: "",
    quantite_vendue: "",
  });
  const [guichet_id, setGuichet_id] = useState([]);
  const [caisse_id, setCaisse_id] = useState({
    value: 1,
    label: "Caisse principal",
  });
  const [OptionsGuichetNonLivre, setOptionsGuichetNonLivre] = useState([]);
  const [ListeGuichetNonLivre, setListeGuichetNonLivre] = useState([]);
  const [OptionsCaisse, setOptionsCaisse] = useState([]);

  const [guichetSelected, setGuichetSelected] = useState(
    intializeVenteSelected
  );

  const {
    id,
    motif,
    date_saisi,
    date_vente,
    client,
    etat_vente,
    ordonnance,
    societe,
    file_societe,
    societe_prise_en_charge,
    caisse,
    guichet,
    caissier,
    guichetier,
  } = guichetSelected[0];
  const getAll = () => {
    if (guichet_id.value)
      getData("vente/details", setGuichetSelected, guichet_id.value);
  };
  const updateOneVenteDetail = () => {
    if (edit_item.quantite_vendue == "") return;
    if (!guichet_id.value) {
      toast.warning("Veulliez séléctionné une guichet de vente!");
    }
    updateData("vente/details", guichet_id.value, { data: edit_item }, () => {
      getAll();
      setEdit_item({
        code_lot_produit: "",
        vente_id: "",
        quantite_vendue: "",
      });
    });
  };

  const validateVenteCaisse = () => {
    if (!guichet_id.value) {
      toast.warning("Veulliez séléctionné une guichet de vente!");
      return;
    }
    if (!caisse_id.value) {
      toast.warning("Veulliez séléctionné une caisse de vente!");
      return;
    }
    confirmDelete(
      `Valider la vente #${guichet_id.value} ?`,
      () => {
        updateData(
          "vente/caisse",
          guichet_id.value,
          {
            caisse_id: caisse_id.value,
            vente_id: guichet_id.value,
            date_vente: getDateNow(),
          },
          () => {
            setIsAdd("0");
            getAll();
            getData("vente/GuichetNonLivrer", (data) => {
              let options = [];
              data.forEach((element) => {
                options.push({ label: element.id, value: element.id });
              });
              setOptionsGuichetNonLivre(options);
            });
            setEdit_item({
              code_lot_produit: "",
              vente_id: "",
              quantite_vendue: "",
            });
            setGuichet_id({ label: "", value: "" });
            setGuichetSelected(intializeVenteSelected);
          }
        );
      },
      "Valider",
      "success",
      "Vente (Livraison)"
    );
  };

  const getNameUniteById = (id) => {
    return listUnite.find((a) => a.id === id).nom_unite;
  };

  const getInfoVente = (item) =>{ 
   let info = "Vente " + item.produit.nom_produit + " : ";
   if (item.unite.id == item.produit.unite_stock) {
      info += item.quantite_vendue + " " + item.unite.nom_unite 
   } else if (item.unite.id == item.produit.unite_presentation) {
     if (item.produit.presentation_quantite > item.quantite_vendue)
       info += item.quantite_vendue + " " + item.unite.nom_unite 
     else {
       let nbr = 0;
       let reste = item.quantite_vendue;
       for (
         let index = 0;
         index <
         parseFloat(item.quantite_vendue) *
           parseFloat(item.produit.presentation_quantite);
         index++
       ) {
         if (item.produit.presentation_quantite > reste) break;
         reste -= item.produit.presentation_quantite;
         nbr++;
       }
       info += nbr + " " + getNameUniteById(item.produit.unite_stock);
       if (reste > 0) info += " et " + reste + " " + item.unite.nom_unite; 
     }
   }
    return info
  }

  React.useEffect(() => {
    getData("vente/GuichetNonLivrer", (data) => {
      setListeGuichetNonLivre(data);
      console.log(data);
      let options = [];
      data.forEach((element) => {
        options.push({ label: element.id, value: element.id });
      });
      setOptionsGuichetNonLivre(options);
    });
    getData("unite", setListUnite);
    // getData("caisse", (data) => convertToOption(data, setOptionsCaisse));
  }, []);
  React.useEffect(() => {
    if (guichet_id.value)
      getData("vente/details", setGuichetSelected, guichet_id.value);
  }, [guichet_id]);
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="px-4 mt-4">
              <h4 className="mb-3">Liste des ventes à validées</h4>
              <div className="w-100">
                <div
                  className="basic-list-group"
                  style={{ overflowY: "auto", maxHeight: "35vh" }}
                >
                  <ul className="list-group">
                    {ListeGuichetNonLivre.length > 0 ? (
                      ListeGuichetNonLivre.map((element) => (
                        <>
                          <li
                            key={element.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <p className="mb-2">
                              {element.id +
                                " / " +
                                "Guichet_000" +
                                element.guichet_id +
                                " / " +
                                element.date_saisi}
                            </p>
                            <a
                              href="#__list"
                              className="badge light badge-success"
                              onClick={() => {
                                setGuichet_id({
                                  label: element.id,
                                  value: element.id,
                                });
                              }}
                            >
                              <i className="fa fa-circle mr-3"></i>
                              Traiter
                            </a>
                          </li>
                        </>
                      ))
                    ) : (
                      <li
                        key={element.id}
                        className="list-group-item d-flex justify-content-center align-items-center text-danger fs-3"
                      >
                        Aucune vente disponnible
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              {/* <div className="row align-items-center">
                <SelectForm
                  defaultValue={
                    OptionsCaisse[0]
                      ? OptionsCaisse[0]
                      : { label: "Choisissez votre caisse", value: "0" }
                  }
                  val={caisse_id}
                  value={filterOption(OptionsCaisse, caisse_id)}
                  options={OptionsCaisse}
                  onChange={(e) => {
                    setCaisse_id(e);
                  }}
                  obligatory={true ? "active" : ""}
                />
                <button className="btn btn-sm btn-default" onClick={getAll}>
                  <i className="fa fa-refresh"></i>
                </button>
                <SelectForm
                  defaultValue={
                    OptionsGuichetNonLivre[0]
                      ? OptionsGuichetNonLivre[0]
                      : { label: "Choisissez un guichet", value: "0" }
                  }
                  val={guichet_id}
                  value={filterOption(OptionsGuichetNonLivre, guichet_id)}
                  options={OptionsGuichetNonLivre}
                  onChange={(e) => {
                    setGuichet_id(e);
                  }}
                  obligatory={true ? "active" : ""}
                />
              </div>
              <span className="float-right">
                Date de saisie :<strong> {date_saisi}</strong>
              </span> */}
              <hr
                style={{
                  height: 2,
                  borderWidth: 0,
                  color: "gray",
                  backgroundColor: "gray",
                }}
              />
            </div>
            <div className="card-body">
              {guichetSelected[0].motif ? (
                <>
                  <div className="row">
                    <div className="col-4">
                      <div>
                        {" "}
                        <strong>Motif : </strong> <span>{motif}</span>
                      </div>
                      <div>
                        {" "}
                        <strong>Date de vente : </strong>
                        <br />
                        <span>{date_vente}</span>
                      </div>
                      <div>
                        {" "}
                        <strong>Client : </strong>{" "}
                        <span>{client ? client.nom_prenom : ""}&nbsp;</span>
                        <span>(Adresse : {client ? client.adresse : ""} )</span>
                      </div>

                      {ordonnance ? (
                        <>
                          <div>
                            {" "}
                            <strong>Docteur : </strong>{" "}
                            <span>{ordonnance.nom_docteur}</span>
                          </div>
                          <div>
                            {" "}
                            <strong>Hopital : </strong>
                            <span>{ordonnance.hopital}</span>
                          </div>
                        </>
                      ) : null}
                    </div>
                    {societe ? (
                      <div className="col-4">
                        <div>
                          {" "}
                          <strong>Nom : </strong>{" "}
                          <span>{societe.nom_societe}</span>
                        </div>
                        <div>
                          {" "}
                          <strong>Prise en charge : </strong>
                          <span>{societe_prise_en_charge}%</span>
                        </div>

                        {file_societe ? (
                          <div>
                            {" "}
                            <strong>Ficher vénant du societe : </strong>
                            <br />
                            <a
                              href={getUrl(
                                "pdf/vente/file_societe",
                                file_societe
                              )}
                              target="_blank"
                              download="file_societe"
                            >
                              <i className="fa fa-download mr-1"></i>{" "}
                              Télécharger le fichier
                            </a>{" "}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : null}
                    <div className="col mb-4 ">
                      {guichetier ? (
                        <div className="row ">
                          <div className="col-3 brand-logo mb-3 mr-4">
                            <img
                              style={{ height: "10vh" }}
                              className="img-fluid "
                              src={
                                guichetier.image
                                  ? getUrl(
                                      "images/utilisateur",
                                      guichetier.image
                                    )
                                  : "images/users/1.jpg"
                              }
                              alt="Image"
                            />
                          </div>
                          <div className="col">
                            <div className="row">
                              Effectuée par :{" "}
                              <b className="d-block">
                                {guichetier.nom_utilisateur}(
                                {guichetier.nom_login})
                              </b>
                            </div>
                            <div className="row">
                              Contact :{" "}
                              <strong className="d-block">
                                {guichetier.contact}
                              </strong>
                            </div>{" "}
                            <div className="row">
                              Email :{" "}
                              <strong className="d-block">
                                {guichetier.email}
                              </strong>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <hr
                    style={{
                      height: 2,
                      borderWidth: 0,
                      color: "gray",
                      backgroundColor: "gray",
                    }}
                  />
                </>
              ) : null}
              <div id="__list">
                <div className="table-responsive">
                  <h4 className="mb-6">Listes des produits commandés</h4>
                  <table className="table table-striped table-responsive-md">
                    <thead>
                      <tr>
                        <th className="center">#</th>
                        <th>Code</th>
                        <th>Produit</th>
                        <th className="right">Prix Unit</th>
                        <th className="center">Qte dde</th>
                        <th className="center">Qte livré</th>
                        <th className="center">Unité</th>
                        <th className="right">Montant HT</th>
                        <th style={{ width: "10px" }}>Option</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guichetSelected[1].length > 0
                        ? guichetSelected[1].map((item, index) => (
                            <tr
                              key={
                                item.produit_code_lot_produit +
                                item.produit.nom_produit
                              }
                            >
                              <td className="center">{++index}</td>
                              <td className="left strong">
                                {item.produit_code_lot_produit}
                              </td>
                              <td className="left">
                                <div className="">
                                  <p >{item.produit.nom_produit}</p>
                                  <hr style={{ marginTop : "-12px", marginBottom: "6px" }} className="border border-secondary" />
                                  <span>
                                     {getInfoVente(item)}
                                  </span>
                                </div>
                              </td>
                              <td className="right">
                                {numberWithCommas(item.prix_vente)}
                              </td>
                              <td className="center">
                                {`${numberWithCommas(item.quantite_demande)}`}
                              </td>
                              <td className="center">
                                {edit_item.code_lot_produit ===
                                item.produit_code_lot_produit ? (
                                  <InputForm
                                    key={edit_item.code_lot_produit}
                                    double
                                    maxi={parseFloat(item.quantite_demande)}
                                    val={edit_item.quantite_vendue}
                                    onChange={(e) => {
                                      setEdit_item({
                                        code_lot_produit:
                                          edit_item.code_lot_produit,
                                        vente_id: item.vente_id,
                                        quantite_vendue: e.target.value,
                                      });
                                    }}
                                    onKeyPress={(e) => {
                                      if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                      }
                                      if (e.key == "Enter" && edit_item) {
                                        updateOneVenteDetail();
                                      }
                                    }}
                                  />
                                ) : (
                                  item.quantite_vendue
                                )}{" "}
                              </td>
                              <td className="center">{item.unite.nom_unite}</td>
                              <td className="right">
                                {numberWithCommas(item.montant_vente)}
                              </td>
                              <td className="center">
                                {
                                  <ButtonTable
                                    importance={
                                      edit_item.code_lot_produit ===
                                      item.produit_code_lot_produit
                                        ? "success"
                                        : "warning"
                                    }
                                    icon={
                                      edit_item.code_lot_produit ===
                                      item.produit_code_lot_produit
                                        ? faCheck
                                        : faEdit
                                    }
                                    handleClick={() => {
                                      if (
                                        edit_item.code_lot_produit ===
                                        item.produit_code_lot_produit
                                      ) {
                                        updateOneVenteDetail();
                                      } else if (
                                        edit_item.code_lot_produit === ""
                                      ) {
                                        setEdit_item({
                                          code_lot_produit:
                                            item.produit_code_lot_produit,
                                          vente_id: item.vente_id,
                                          quantite_vendue: item.quantite_vendue,
                                        });
                                      }
                                    }}
                                  />
                                }
                              </td>
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </table>
                </div>

                {guichetSelected[1].length > 0 ? (
                  <div className="row">
                    <div className="col-lg-4 col-sm-5"> </div>
                    <div className="col-lg-4 col-sm-5 ml-auto">
                      <table className="table table-clear">
                        <tbody>
                          <tr className="border text-white" style={{fontSize:'1.1rem', textTransform: 'uppercase', textAlign:'center', background:'#000'}}>
                            <td className="left">
                              <b>Total</b>
                            </td>
                            <td className="right">
                              <b>
                                {numberWithCommas(
                                  guichetSelected[1].reduce(
                                    (acc, item) =>
                                      (acc += parseFloat(item.montant_vente)),
                                    0
                                  )
                                ) + " Ar"}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="card-footer">
              <div className="row w-100>">
                <div className="col-2">
                  <button
                    className="btn btn-info btn-lg w-100 light "
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Listes des ventes validées"
                    onClick={() => {
                      setIsAdd("0");
                    }}
                  >
                    <i className="fa fa-list-alt"></i>
                  </button>
                </div>
                <div className="col ">
                  <button
                    className="btn btn-danger btn-lg w-100 light "
                    onClick={() => {
                      setEdit_item({
                        code_lot_produit: "",
                        vente_id: "",
                        quantite_vendue: "",
                      });
                      setCaisse_id([]);
                      setGuichetSelected(intializeVenteSelected);
                      // window.location.reload();
                    }}
                  >
                    Annuler
                  </button>
                </div>
                <div className="col-7">
                  <button
                    className="btn btn-primary btn-lg w-100 mr-2"
                    // data-toggle="modal"
                    // data-target="#modalInsert"
                    onClick={validateVenteCaisse}
                  >
                    Livrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Insert;
