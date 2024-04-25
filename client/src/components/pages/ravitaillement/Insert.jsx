import React, { useEffect, useState } from "react";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import {
  intializeRavitaillement,
  intializeRavitaillementDetails,
  toggleAddTableEdit,
} from "../../../atoms/ravitaillement";
import {
  addData,
  ButtonTable,
  confirmDelete,
  convertToOption,
  filterOption,
  getData,
  InputForm,
  onChange,
  SelectForm,
  getDateNow,
  verifObligatory,
} from "../../../utils/utils";
import { userConnected } from "../../../atoms/authentication";

function Insert() {
  const [toggle, setToggle] = useRecoilState(toggleAddTableEdit);
  const [userConnect, setUserConnect] = useRecoilState(userConnected);
  const [ravitaillement, setRavitaillement] = useState(intializeRavitaillement);
  const [ravitaillementDetails, setRavitaillementDetails] = useState(
    intializeRavitaillementDetails
  );
  const [produit, setProduit] = useState({});
  const [isObRvt, setIsObRvt] = useState(false);
  const [isObRvtDt, setIsObRvtDt] = useState(false);
  const [listRavitaillementDetails, setListRavitaillementDetails] = useState(
    []
  );
  const [OptionsProduit, setOptionsProduit] = useState([]);
  const [OptionsMode_expedition, setOptionsMode_expedition] = useState([]);
  const [OptionsFournisseur, setOptionsFournisseur] = useState([]);
  const {
    motif,
    etat_ravitaillement,
    date_prev_livraison,
    tva,
    caisse_id,
    fournisseur_id,
    mode_expedition_id,
  } = ravitaillement;
  const {
    prix_unit,
    produit_code_lot_produit,
    nom_produit,
    prix_ht,
    quantite_demande,
    unite_achat,
  } = ravitaillementDetails;

  const addItemInList = () => {
    setIsObRvtDt(true);
    // console.log("rvtDetail", {
    //   ...ravitaillementDetails,
    //   produit_code_lot_produit: produit_code_lot_produit.value,
    //   nom_produit: produit.nom_produit,
    //   prix_ht: parseInt(tva) * parseInt(prix_unit),
    //   unite_achat: produit.unite_stock,
    //   montant_ht: parseInt(quantite_demande) * parseInt(prix_unit),
    // });
    if (
      verifObligatory({
        ...ravitaillementDetails,
        produit_code_lot_produit: produit_code_lot_produit.value,
        nom_produit: produit.nom_produit,
        prix_ht: parseInt(tva) * parseInt(prix_unit),
        unite_achat: produit.unite_stock,
        montant_ht: parseInt(quantite_demande) * parseInt(prix_unit),
      }) &&
      tva
    )
      return;
    let verif = false;
    Object.entries(listRavitaillementDetails).forEach(([key, value]) => {
      if (value.produit_code_lot_produit === produit.code_lot_produit)
        verif = true;
    });
    if (verif) {
      toast.warning(
        "Cette produit existe déjà dans la liste; veuillez seulement modifié votre commande dans cette dernière ?"
      );
      return;
    }
    setListRavitaillementDetails([
      ...listRavitaillementDetails,
      {
        ...ravitaillementDetails,
        produit_code_lot_produit: produit_code_lot_produit.value,
        nom_produit: produit.nom_produit,
        prix_ht: parseInt(tva) * parseInt(prix_unit),
        unite_achat: produit.unite_stock,
        montant_ht: parseInt(quantite_demande) * parseInt(prix_unit),
      },
    ]);

    // console.log("listRavitaillementDetails", listRavitaillementDetails);
  };

  useEffect(() => {
    getData("fournisseur", (data) =>
      convertToOption(data, setOptionsFournisseur)
    );
    getData("Produit", (data) => {
      convertToOption(
        data,
        setOptionsProduit,
        "nom_produit",
        "code_lot_produit"
      );
    });
    getData("Mode_expedition", (data) =>
      convertToOption(data, setOptionsMode_expedition)
    );
  }, []);

  const myFilterProduit = () => {
    filterOption(OptionsProduit, produit_code_lot_produit);
  };
  const getTotalsHT = () => {
    if (listRavitaillementDetails.length > 0) {
      let total = 0;
      listRavitaillementDetails.forEach((item) => {
        total += item.montant_ht;
      });
      return total;
    }
  };

  const getTotalsTVA = () => {
    if (listRavitaillementDetails.length > 0) {
      let total = 0;
      listRavitaillementDetails.forEach((item) => {
        total += item.montant_ht * (tva / 100);
      });
      return total;
    }
  };

  const getTotalsTTC = () => {
    if (listRavitaillementDetails.length > 0) {
      let total = 0;
      listRavitaillementDetails.forEach((item) => {
        total += item.montant_ht;
      });
      return total * (1 + tva / 100);
    }
  };

  const add = () => {
    // console.log("ravitaillement", ravitaillement);
    setIsObRvt(true);
    let dataRvt = {
      motif,
      etat_ravitaillement: "COMMANDE",
      date_saisi: getDateNow(),
      date_prev_livraison,
      tva,
      utilisateur_id: userConnect.id,
      fournisseur_id: fournisseur_id.value,
      mode_expedition_id: mode_expedition_id.value,
      montant_ht: getTotalsHT(),
    };
    let dataRvtDetail = [];
    listRavitaillementDetails.map((item) => {
      dataRvtDetail.push({
        ...item,
        ["quantite_livraison"]: item.quantite_demande,
      });
    });
    // console.log("{ dataRvt, dataRvtDetail }", { dataRvt, dataRvtDetail });
    if (
      !motif ||
      !fournisseur_id.value ||
      !mode_expedition_id.value ||
      !date_prev_livraison ||
      !tva ||
      dataRvtDetail.length <= 0
    ){
      window.location.href = "#divInsertRvt";
      return;}
    addData("ravitaillement", { dataRvt, dataRvtDetail }, () => {
      setToggle(0);
    });
  };

  return (
    <div className="card m-auto" id="divInsertRvt">
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-xl-6 col-sm-12">
            <InputForm
              textarea
              rows="2"
              name="motif"
              val={motif}
              onChange={(e) => onChange(e, setRavitaillement)}
              obligatory={isObRvt ? "active" : ""}
            >
              Motif
            </InputForm>
            <div className="row">
              <div className="col-xl-6 col-sm-12">
                <SelectForm
                  val={fournisseur_id}
                  value={filterOption(OptionsFournisseur, fournisseur_id)}
                  options={OptionsFournisseur}
                  onChange={(e) =>
                    onChange(e, setRavitaillement, "fournisseur_id")
                  }
                  obligatory={isObRvt ? "active" : ""}
                >
                  Fournisseur
                </SelectForm>
              </div>
              <div className="col-xl-6 col-sm-12">
                <SelectForm
                  val={mode_expedition_id}
                  value={filterOption(
                    OptionsMode_expedition,
                    mode_expedition_id
                  )}
                  options={OptionsMode_expedition}
                  onChange={(e) =>
                    onChange(e, setRavitaillement, "mode_expedition_id")
                  }
                  obligatory={isObRvt ? "active" : ""}
                >
                  Mode d'expedition
                </SelectForm>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-8 col-sm-12">
                <InputForm
                  date
                  min={getDateNow("date")}
                  name="date_prev_livraison"
                  val={date_prev_livraison}
                  onChange={(e) => onChange(e, setRavitaillement)}
                  obligatory={isObRvt ? "active" : ""}
                >
                  Date prévue pour la livraison
                </InputForm>
                {/* <label className="font-w600" htmlFor="datepicker">
                  Date prévue pour la livraison
                </label>
                <input
                  name="datepicker"
                  className="datepicker-default form-control picker__input"
                  id="datepicker"
                  readOnly
                  aria-haspopup="true"
                  aria-expanded="false"
                  aria-readonly="false"
                  aria-owns="datepicker_root"
                />*/}
              </div>
              <div className="col-xl-4 col-sm-12">
                <InputForm
                  integer
                  postIcon={{ text: "%" }}
                  name="tva"
                  val={tva}
                  onChange={(e) => onChange(e, setRavitaillement)}
                  obligatory={isObRvt ? "active" : ""}
                >
                  TVA
                </InputForm>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-sm-12">
            <div className="shadow-sm p-4">
              <div className="row">
                <div className="col-xl-7 col-sm-12">
                  <SelectForm
                    val={produit_code_lot_produit}
                    value={OptionsProduit.filter(
                      (option) =>
                        JSON.stringify(option) ===
                        JSON.stringify(produit_code_lot_produit)
                    )}
                    options={OptionsProduit}
                    onChange={(e) => {
                      onChange(
                        e,
                        setRavitaillementDetails,
                        "produit_code_lot_produit"
                      );
                      if (e.value)
                        getData(
                          "produit",
                          (data) => setProduit(data[0]),
                          e.value
                        );
                    }}
                    obligatory={isObRvtDt ? "active" : ""}
                  >
                    Produit
                  </SelectForm>
                </div>
                <div className="col-xl-5 col-sm-12">
                  <InputForm
                    postIcon={{ text: "Ar" }}
                    integer
                    name="prix_unit"
                    val={prix_unit}
                    onChange={(e) => onChange(e, setRavitaillementDetails)}
                    obligatory={isObRvtDt ? "active" : ""}
                  >
                    Prix unitaire
                  </InputForm>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-4 col-sm-12">
                  <InputForm
                    integer
                    name="quantite_demande"
                    val={quantite_demande}
                    onChange={(e) => onChange(e, setRavitaillementDetails)}
                    obligatory={isObRvtDt ? "active" : ""}
                  >
                    Qte demandé
                  </InputForm>
                </div>
                <div className="col-xl-4 col-sm-12">
                  <label className="font-w600">Unité stock</label>
                  <span
                    className="badge badge-warning light"
                    style={{ padding: "1.75vh", marginTop: "-0.35vh" }}
                  >
                    {produit.nom_stock}
                  </span>
                </div>
                <div className="col-xl-4 col-sm-12">
                  <button
                    className="btn btn-outline-warning w-100"
                    style={{ marginTop: "4.25vh" }}
                    onClick={addItemInList}
                  >
                    <i className="fa fa-market"></i> Ajouter
                  </button>
                </div>
              </div>
              <p className="mt-3 text-center mb-0">
                {prix_unit && quantite_demande ? (
                  <>
                    Prix HT : <b>{prix_unit * quantite_demande} Ar</b>{" "}
                    &nbsp;&nbsp;&nbsp; & &nbsp;&nbsp;&nbsp;
                  </>
                ) : null}
                {prix_unit && quantite_demande && tva ? (
                  <>
                    Prix TCC :{" "}
                    <b>{prix_unit * quantite_demande * (1 + tva / 100)} Ar</b>
                  </>
                ) : null}
              </p>
            </div>
          </div>
        </div>
        <hr />
        <div className="mt-4">
          <div className="table-responsive">
            <table className="table table-striped table-responsive-md">
              <thead>
                <tr>
                  <th className="center">#</th>
                  <th>Code</th>
                  <th>Produit</th>
                  <th className="right">Prix Unit</th>
                  <th className="center">Qte</th>
                  <th className="right">Montant HT</th>
                  <th style={{ widht: "100px" }} className="center">
                    Option
                  </th>
                </tr>
              </thead>
              <tbody>
                {listRavitaillementDetails.map((item) => (
                  <tr key={item.code_lot_produit + item.nom_produit}>
                    <td className="center">1</td>
                    <td className="left strong">
                      {item.produit_code_lot_produit}
                    </td>
                    <td className="left">{item.nom_produit}</td>
                    <td className="right">{item.prix_unit}</td>
                    <td className="center">{item.quantite_demande}</td>
                    <td className="right">{item.montant_ht}</td>
                    <th className="center">
                      <ButtonTable
                        importance="warning"
                        icon={faEdit}
                        handleClick={() => {
                          setRavitaillementDetails(
                            intializeRavitaillementDetails
                          );
                          getData(
                            "produit",
                            (data) => setProduit(data[0]),
                            item.produit_code_lot_produit
                          );
                          setRavitaillementDetails({
                            prix_unit: item.prix_unit,
                            produit_code_lot_produit: {
                              label: item.nom_produit,
                              value: item.produit_code_lot_produit,
                            },
                            nom_produit: item.nom_produit,
                            prix_ht: item.prix_ht,
                            montant_ht: item.montant_ht,
                            quantite_demande: item.quantite_demande,
                            unite_achat: item.unite_achat,
                          });
                          // console.log(
                          //   "ravitaillementDetails",
                          //   ravitaillementDetails
                          // );
                          setListRavitaillementDetails([
                            ...listRavitaillementDetails.slice(
                              0,
                              listRavitaillementDetails.indexOf(item)
                            ),
                            ...listRavitaillementDetails.slice(
                              listRavitaillementDetails.indexOf(item) + 1
                            ),
                          ]);
                        }}
                      />
                      <ButtonTable
                        importance="danger"
                        icon={faTrash}
                        handleClick={() => {
                          confirmDelete(
                            "Retirer cet élément de la liste des commandes ?",
                            () => {
                              setListRavitaillementDetails([
                                ...listRavitaillementDetails.slice(
                                  0,
                                  listRavitaillementDetails.indexOf(item)
                                ),
                                ...listRavitaillementDetails.slice(
                                  listRavitaillementDetails.indexOf(item) + 1
                                ),
                              ]);
                            }
                          );
                        }}
                      />
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {listRavitaillementDetails.length > 0 ? (
            <div className="row">
              <div className="col-lg-4 col-sm-5"> </div>
              <div className="col-lg-4 col-sm-5 ml-auto">
                <table className="table table-clear">
                  <tbody>
                    <tr>
                      <td className="left">
                        <strong>Totals HT</strong>
                      </td>
                      <td className="right">{getTotalsHT()}</td>
                    </tr>
                    <tr>
                      <td className="left">
                        <strong>TVA ({tva}%)</strong>
                      </td>
                      <td className="right">{getTotalsTVA()}</td>
                    </tr>
                    <tr>
                      <td className="left">
                        <strong>Totals TTC</strong>
                      </td>
                      <td className="right">
                        <strong>{getTotalsTTC()}</strong>
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
        <div className="row">
          <div className="col-4">
            <button
              className="btn btn-danger light btn-lg w-100 "
              onClick={() => {
                setRavitaillement(intializeRavitaillement);
                setRavitaillementDetails(intializeRavitaillementDetails);
                setListRavitaillementDetails([]);
                setToggle(0);
              }}
            >
              Annuler
            </button>
          </div>
          <div className="col-8">
            <button className="btn btn-primary btn-lg w-100 mr-1" onClick={add}>
              Efféctuer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insert;
