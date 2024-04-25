import React, { useEffect, useState } from "react";
import {
  faCheck,
  faEdit,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import { useRecoilState } from "recoil";
import {
  ravitaillementSelect,
  toggleAddTableEdit,
} from "../../../atoms/ravitaillement";
import { 
  ButtonTable, 
  getData,
  getUrl, 
  updateData, 
} from "../../../utils/utils"; 

function Edit() {
  const [toggle, setToggle] = useRecoilState(toggleAddTableEdit);
  const [edit_item, setEdit_item] = useState({
    code_lot_produit: "",
    ravitaillement_id: "",
    quantite_livraison: "",
  });
  const [rvtSelect, setRvtSelect] = useRecoilState(ravitaillementSelect);
  const [ravitaillement, setRavitaillement] = useState({});
  const [listRavitaillementDetails, setListRavitaillementDetails] = useState(
    []
  );

  const { motif, tva, date_saisi, date_prev_livraison } = ravitaillement;

  const getTotalsHT = () => {
    if (listRavitaillementDetails.length > 0) {
      let total = 0;
      listRavitaillementDetails.forEach((item) => {
        total += item.quantite_livraison * item.prix_unit;
      });
      return total;
    }
  };

  const getTotalsTVA = () => {
    if (listRavitaillementDetails.length > 0) {
      let total = 0;
      listRavitaillementDetails.forEach((item) => {
        total +=  item.quantite_livraison * item.prix_unit * (tva / 100);
      });
      return total;
    }
  };

  const getTotalsTTC = () => { 
      return getTotalsHT() * (1 + tva / 100); 
  };

  const updateOneRavitaillementDetail = () => {
    if (edit_item.quantite_livraison === "") return;
    updateData(
      "updateOneRavitaillementDetail",
      rvtSelect.id,
      { data: edit_item },
      () => {
        getAll();
        setEdit_item({
          code_lot_produit: "",
          ravitaillement_id: "",
          quantite_livraison: "",
        });
      }
    );
  };

  const getAll = () => {
    getData(
      "ravitaillement",
      (data) => { 
        setRavitaillement(data[0]);
        setListRavitaillementDetails(data[1]);
      },
      rvtSelect.id
    );
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              {" "}
              Date de saisie
              <strong>{date_saisi}</strong>
              <span className="float-right">
                <strong>Etat:</strong> COMMANDE
              </span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-4 mb-4">
                  <h6>Entêt:</h6>
                  <div>
                    {" "}
                    <strong>Motif : </strong> <span>{motif}</span>
                  </div>
                  <div>
                    {" "}
                    <strong>Date prévue pour la livraison : </strong>
                    <br />
                    <span>{date_prev_livraison}</span>
                  </div>
                  <div>
                    {" "}
                    <strong>Expédié par la : </strong>{" "}
                    <span>
                      {ravitaillement.mode_expedition
                        ? ravitaillement.mode_expedition.nom_mode_expedition.toLowerCase()
                        : ""}
                    </span>
                  </div>
                  <div>
                    {" "}
                    <strong>TVA : </strong> <span>{tva}</span>
                  </div>
                </div>
                <div className="col-4 mb-4">
                  <h6>Fournisseur:</h6>
                  {ravitaillement.fournisseur ? (
                    <>
                      {" "}
                      <div>
                        {" "}
                        <strong>Nom : </strong>{" "}
                        <span>
                          {ravitaillement.fournisseur.nom_fournisseur}
                        </span>
                      </div>
                      <div>
                        {" "}
                        <strong>Contact sécrétaire : </strong>{" "}
                        <span>
                          {ravitaillement.fournisseur.contact_secretaire}
                        </span>
                      </div>
                      <div>
                        <strong>Email : </strong>
                        <br /> <span>{ravitaillement.fournisseur.email}</span>
                      </div>
                      <div>
                        <strong>Adresse : </strong>
                        <br /> <span>{ravitaillement.fournisseur.adresse}</span>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-4 mb-4 ">
                  <div className="row align-items-center">
                    <div className="col-sm-12">
                      {ravitaillement.utilisateur ? (
                        <>
                          <div className="brand-logo mb-3">
                            <img
                              style={{ height: "10vh" }}
                              className="img-fluid "
                              src={
                                ravitaillement.utilisateur.image
                                  ? getUrl(
                                      "images/utilisateur",
                                      ravitaillement.utilisateur.image
                                    )
                                  : "images/users/1.jpg"
                              }
                              alt="Image"
                            />
                          </div>
                          <div>
                            Effectuée par :{" "}
                            <b className="d-block">
                              {ravitaillement.utilisateur.nom_utilisateur}
                            </b>
                          </div>
                          <div>
                            Contact :{" "}
                            <strong className="d-block">
                              {ravitaillement.utilisateur.contact}
                            </strong>
                          </div>
                          {/* <div>
                    Email :{" "}
                    <strong className="d-block">{utilisateur.email}</strong> 
                  </div>  */}
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-striped table-responsive-md">
                  <thead>
                    <tr>
                      <th className="center">#</th>
                      <th>Code</th>
                      <th>Produit</th>
                      <th className="center">Qte Livrée</th>
                      <th className="center"></th>
                      <th className="right">Prix Unit</th>
                      <th className="right">Montant HT</th>
                      <th style={{ width: "10px" }}>Option</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listRavitaillementDetails.length > 0
                      ? listRavitaillementDetails.map((item) => (
                          <tr
                            key={
                              item.produit_code_lot_produit + item.nom_produit
                            }
                          >
                            <td className="center">1</td>
                            <td className="left strong">
                              {item.produit_code_lot_produit}
                            </td>
                            <td className="left">{item.produit.nom_produit}</td>
                            <td className="center">
                              {edit_item.code_lot_produit ===
                              item.produit_code_lot_produit ? (
                                <input
                                  key={edit_item.code_lot_produit}
                                  className="form-control"
                                  value={edit_item.quantite_livraison}
                                  onChange={(e) => {
                                    console.log("item", edit_item);
                                    setEdit_item({
                                      code_lot_produit:
                                        edit_item.code_lot_produit,
                                      ravitaillement_id: item.ravitaillement_id,
                                      quantite_livraison: e.target.value,
                                    });
                                  }}
                                  onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) {
                                      e.preventDefault();
                                    }
                                    if (e.key == "Enter" && edit_item) {
                                      updateOneRavitaillementDetail();
                                    }
                                  }}
                                />
                              ) : (
                                item.quantite_livraison
                              )}{" "}
                            </td>
                            <td className="center">{item.unite.nom_unite}</td>
                            <td className="right">{item.prix_unit}</td>
                            <td className="right">{item.prix_unit * item.quantite_livraison}</td>
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
                                      updateOneRavitaillementDetail();
                                    } else if (
                                      edit_item.code_lot_produit === ""
                                    ) {
                                      setEdit_item({
                                        code_lot_produit:
                                          item.produit_code_lot_produit,
                                        ravitaillement_id:
                                          item.ravitaillement_id,
                                        quantite_livraison: item.quantite_livraison,
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
                          <td className="right">
                            <strong>TVA ({tva}%)</strong>
                          </td>
                          <td className="right">{getTotalsTVA()}</td>
                        </tr>
                        <tr>
                          <td className="right">
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
            <div className="card-footer">
              <div className="row m-auto">
                <div className="col-4">
                  <button
                    className="btn btn-danger btn-lg w-100 light "
                    onClick={() => {
                      setEdit_item({
                        code_lot_produit: "",
                        ravitaillement_id: "",
                        quantite_livraison: "",
                      });
                      setToggle(0);
                      console.clear();
                    }}
                  >
                    Annuler
                  </button>
                </div>
                <div className="col-8">
                  <button
                    className="btn btn-primary btn-lg w-100 mr-2"
                    data-toggle="modal"
                    data-target="#modalEdit"
                  >
                    Livrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal ravitaillement={ravitaillement} listRavitaillementDetails={listRavitaillementDetails} />
    </>
  );
}

export default Edit;
