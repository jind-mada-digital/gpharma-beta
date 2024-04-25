import React from "react";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { ajustementSelect } from "../../../atoms/ajustement";
import { getData, getUrl } from "../../../utils/utils";

function View() {
  const [ajtSelect, setAjttSelect] = useRecoilState(ajustementSelect);
  const [listUnite, setListUnite] = useState([]);
  const [ajustement, setAjustement] = useRecoilState(ajustementSelect);
  const [listAjustementDetails, setListAjustementDetails] = React.useState([]);
  React.useEffect(() => {
    if (ajtSelect.id)
      getData("ajustementDetails", setListAjustementDetails, ajtSelect.id);
  }, [ajtSelect]);

  const { motif, date_saisi, date_ajustement, emplacement } = ajtSelect;
  const getNameUniteById = (id) => {
    return listUnite.find((a) => a.id === id).nom_unite;
  };
  React.useEffect(() => {
    getData("unite", setListUnite);
  }, []);
  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "none", paddingBottom: "10vh" }}
        aria-modal="true"
        data-backdrop="static"
        data-keyboard="true"
        id="modalView"
      >
        <div
          className="modal-dialog modal-lg  modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Information</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => {
                  setAjttSelect({});
                }}
              >
                <span>×</span>
              </button>
            </div>

            <div className="card-header">
              {" "}
              Date de saisie
              <strong>{date_saisi}</strong>
              <span className="float-right">
                <strong></strong> Ajusté
              </span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col mb-4">
                  <div>
                    {" "}
                    <strong>Motif : </strong> <span>{motif}</span>
                  </div>
                  <div>
                    {" "}
                    <strong>Date d'ajustement : </strong>
                    <br />
                    <span>{date_ajustement}</span>
                  </div>
                  <div>
                    {" "}
                    <strong>Emplacement : </strong>{" "}
                    <span>
                      {emplacement ? emplacement.nom_emplacement : ""}
                    </span>
                  </div>
                </div>
                <div className="col mb-4 ">
                  <div className=" ">
                    <div className=" row">
                      {ajustement.utilisateur ? (
                        <>
                          <div className="brand-logo mb-3 mr-4">
                            <img
                              style={{ height: "10vh" }}
                              className="img-fluid "
                              src={
                                ajustement.utilisateur.image
                                  ? getUrl(
                                      "images/utilisateur",
                                      ajustement.utilisateur.image
                                    )
                                  : "images/users/1.jpg"
                              }
                              alt="Image"
                            />
                          </div>
                          <div className="">
                            <div className="row">
                              Effectuée par :{" "}
                              <b className="d-block">
                                {ajustement.utilisateur.nom_utilisateur}({ajustement.utilisateur.nom_login})
                              </b>
                            </div>
                            <div className="row">
                              Contact :{" "}
                              <strong className="d-block">
                                {ajustement.utilisateur.contact}
                              </strong>
                            </div>{" "}
                            <div className="row">
                              Email :{" "}
                              <strong className="d-block">
                                {ajustement.utilisateur.email}
                              </strong>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className=" ">
                <div className="table-responsive">
                  <table className="table table-striped table-responsive-md">
                    <thead>
                      <tr>
                        <th className="center">#</th>
                        <th>Code</th>
                        <th>Produit</th>
                        <th className="right">De</th>
                        <th className="center">A</th> 
                      </tr>
                    </thead>
                    <tbody>
                      {listAjustementDetails.map((item) => (
                        <tr
                          key={
                            item.produit_code_lot_produit +
                            item.produit.nom_produit
                          }
                        >
                          <td className="center">1</td>
                          <td className="left strong">
                            {item.produit_code_lot_produit}
                          </td>
                          <td className="left">{item.produit.nom_produit}</td>
                          <td className="right">
                            <span>
                              Stock : {item.quantite_ancien_stock}{" "}
                              {getNameUniteById(item.unite_ancien_stock)}
                            </span>
                            <br />
                            <span>
                              Prés. : {item.quantite_ancien_presentation}{" "}
                              {getNameUniteById(item.unite_ancien_presentation)}
                            </span>
                          </td>
                          <td className="center">
                            <span>
                              Stock : {item.quantite_nouveau_stock}{" "}
                              {getNameUniteById(item.unite_nouveau_stock)}
                            </span>
                            <br />
                            <span>
                              Prés. : {item.quantite_nouveau_presentation}{" "}
                              {getNameUniteById(
                                item.unite_nouveau_presentation
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default View;
