import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { initialize, produitSelect } from "../../../atoms/produit";
import {
  getClassByNumber,
  getData,
  getEmplacement,
  getUrl,
} from "../../../utils/utils";

function View({ id }) {
  const [produit, setProduit] = useRecoilState(produitSelect);
  return (
    <>
      <div
        className="modal fade"
        id="modalViewProduit"
        style={{ display: "none" }}
        aria-modal="true"
        data-backdrop="static"
        data-keyboard="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Information sur {produit.nom_produit}
              </h5>
              <button
                // ref={closeRef}
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => {}}
              >
                <span
                  onClick={() => {
                    setProduit(initialize);
                  }}
                >
                  ×
                </span>
              </button>
            </div>
            <div className="modal-body">
              <div className="card-body" style={{ margin: "-4vh" }}>
                <div className="row">
                  <div className="col-xl-3 col-lg-6  col-md-6 col-xxl-5 ">
                    <div className="tab-content">
                      <div
                        role="tabpanel"
                        className="tab-pane fade show active"
                        id="first"
                      >
                        <img
                          style={produit.image ? { width: "25vw" } : {}}
                          className="img-fluid"
                          styles={{ borderRadius: "5%" }}
                          src={
                            produit.image
                              ? getUrl("images/produit", produit.image)
                              : `images/product/1.jpg`
                          }
                          alt={`image de ${produit.nom_produit}`}
                        />

                        <p className="text-content mt-3">
                          {produit.description}
                        </p>

                        <p className="text-content mt-3">
                          {produit.classification_produit}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/*Tab slider End*/}
                  <div className="col-xl-9 col-lg-6  col-md-6 col-xxl-7 col-sm-12">
                    <div className="product-detail-content">
                      {/*Product details*/}
                      <div className="new-arrival-content pr">
                        <h4>
                          {produit.nom_produit} (Voie <b>{produit.nom_voie}</b>)
                        </h4>
                        {/* <div className="comment-review star-rating">
                          <ul>
                            <li>
                              <i className="fa fa-star" />
                            </li>
                            <li>
                              <i className="fa fa-star" />
                            </li>
                            <li>
                              <i className="fa fa-star" />
                            </li>
                            <li>
                              <i className="fa fa-star-half-empty" />
                            </li>
                            <li>
                              <i className="fa fa-star-half-empty" />
                            </li>
                          </ul>
                          <span className="review-text">(34 vente(s)){/*  /   </span>
                          <Link
                            to="caisse"
                            type="button"
                            className="product-review"
                          >
                            Voir les détails de ses ventes?
                          </Link>  
                        </div> */}
                        <div className="d-table mb-2">
                          <p className="price float-left d-block">
                            {produit.prix_stock} Ar
                          </p>
                        </div>
                        <p>
                          Code lot produit:
                          <span className=" ml-2 text-success font-w600">
                            {produit.code_lot_produit}
                          </span>
                        </p>
                        <p>
                          Date de péremption:
                          <span className="ml-2 text-black font-w400">
                            {produit.date_peremption}
                          </span>
                        </p>
                        <p>
                          Dernière date de ravitaillement:
                          <span className="ml-2 text-black font-w400">
                            {produit.date_der_ravitaillement}
                          </span>
                        </p>
                        {produit.emplacement &&
                        getEmplacement(produit.emplacement)[1] ? (
                          getEmplacement(produit.emplacement)[1]
                            .quantite_produit > 0 ? (
                            <p>
                              Etaté :
                              <span className="ml-2 item">
                                <span
                                  className={
                                    "badge badge-" +
                                    getClassByNumber(
                                      parseFloat(
                                        getEmplacement(produit.emplacement)[1]
                                          .quantite_produit
                                      )
                                    ) +
                                    " light"
                                  }
                                >
                                  {
                                    getEmplacement(produit.emplacement)[1]
                                      .quantite_produit
                                  }
                                </span>
                              </span>
                            </p>
                          ) : (
                            "0"
                          )
                        ) : (
                          ""
                        )}
                        <p>
                          Stock Générale :&nbsp;&nbsp;
                          <span
                            className={
                              "badge badge-" +
                              getClassByNumber(produit.quantite_stock) +
                              " light"
                            }
                          >
                            Quatité : {produit.quantite_stock}
                          </span>
                        </p>
                        <p>
                          Seuil :&nbsp;&nbsp;
                          <span className="badge badge-danger light">
                            Stock min : {produit.stock_min}
                          </span>
                          <span className="badge badge-success light">
                            Stock max : {produit.stock_max}
                          </span>
                        </p>
                        <p>
                          Statut :&nbsp;&nbsp;
                          <span
                            className={
                              produit.status == "1"
                                ? "badge light badge-success"
                                : "badge light badge-danger"
                            }
                          >
                            <i
                              className={
                                produit.status == "1"
                                  ? "fa fa-circle text-success mr-1"
                                  : "fa fa-circle text-danger mr-1"
                              }
                            />
                            {produit.status == "1" ? "Activé" : "Désactivé"}
                          </span>
                        </p>

                        <div className="row mt-3">
                          <div className="col-6">
                            <h5 className="tex-dark mb-3">Détails</h5>
                            <div className="d-flex align-items-center mr-auto pr-2">
                              <div>
                                <p className="mb-sm-2 mb-1 text-dark">
                                  Fabricant :{" "}
                                  <span className="fs-14 text-primary font-w600">
                                    {produit.nom_fabricant}
                                  </span>
                                  ,
                                </p>
                                <p className="mb-sm-2 mb-1 text-dark">
                                  Famille :{" "}
                                  <span className="fs-14 text-secondary font-w600">
                                    {produit.nom_famille}
                                  </span>
                                  ,
                                </p>
                                <p className="mb-sm-2 mb-1 text-dark">
                                  Forme :{" "}
                                  <span className="fs-14 text-warning font-w600">
                                    {produit.nom_forme}
                                  </span>
                                  .
                                </p>
                                <p className="mb-sm-2 mb-1 text-dark">
                                  Quantité de présentation :{" "}
                                  <span
                                    className={
                                      "fs-14 text-" +
                                      getClassByNumber(
                                        produit.presentation_quantite
                                      ) +
                                      " font-w600"
                                    }
                                  >
                                    {produit.presentation_quantite}
                                  </span>
                                  .
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-6">
                            <h5 className="tex-dark mb-3">Unités</h5>
                            <div className="d-flex align-items-center mr-auto pr-2">
                              <div>
                                {/* <p className="mb-sm-2 mb-1 text-dark">
                                  Achat :{" "}
                                  <span className="fs-14 text-primary font-w600">
                                    {produit.nom_achat}
                                  </span>
                                  ,
                                </p>
                                <p className="mb-sm-2 mb-1 text-dark">
                                  Vente :{" "}
                                  <span className="fs-14 text-secondary font-w600">
                                    {produit.nom_vente}
                                  </span>
                                  ,
                                </p> */}
                                <p className="mb-sm-2 mb-1 text-dark">
                                  Stock :{" "}
                                  <span className="fs-14 text-warning font-w600">
                                    {produit.nom_stock}
                                  </span>
                                  .
                                </p>
                                <p className="mb-sm-2 mb-1 text-dark">
                                  Présentation :{" "}
                                  <span className="fs-14 text-primary font-w600">
                                    {produit.nom_presentation}
                                  </span>
                                  ,
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
