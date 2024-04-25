import React from "react";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { venteSelect, intializeVenteSelected } from "../../../atoms/caisse";
import { getData, getUrl, numberWithCommas } from "../../../utils/utils";

function View() {
  const [venteSelected, setVenteSelected] = useRecoilState(venteSelect);

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
  } = venteSelected[0]; 
  const [listUnite, setListUnite] = useState([]);
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
  React.useEffect(()=>{
    getData("unite", setListUnite);
  },[])
  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "none", paddingBottom: "10vh" }}
        aria-modal="true"
        data-backdrop="static"
        data-keyboard="true"
        id="modalViewVente"
      >
        <div
          className="modal-dialog modal-xl  modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Information:{" "}
                <b>
                  {id ? id : "" + " / " + guichet ? guichet.nom_guichet : ""}
                </b>
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => {
                  setVenteSelected(intializeVenteSelected);
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
                <strong>Etat : </strong>{etat_vente == "0"? "Guichet commandé" : "Vente livrée" }
              </span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-4 mb-4">
                  <div>
                    {" "}
                    <strong>Motif : </strong> <span>{motif}</span>
                  </div>
                  <div>
                    {" "}
                    <strong>Date d'vente : </strong>
                    <br />
                    <span>{date_vente}</span>
                  </div>
                  <div>
                    {" "}
                    <strong>Client : </strong>{" "}
                    <span>{client ? client.nom_prenom : ""}</span>
                    <span>(Adresse : {client ? client.adresse : ""} )</span>
                  </div>
                  
                {ordonnance ? (
                  < >
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
                  <div className="col-4 mb-4">
                    <div>
                      {" "}
                      <strong>Nom : </strong> <span>{societe.nom_societe}</span>
                    </div>
                    <div>
                      {" "}
                      <strong>Prise en charge : </strong>
                      <br />
                      <span>{societe_prise_en_charge}%</span>
                    </div>

                    {file_societe ? (
                      <div>
                        {" "}
                        <strong>Ficher vénant du societe : </strong><br />
                        <a
                          href={getUrl("pdf/vente/file_societe", file_societe)}
                          target="_blank" 
                          download="file_societe"
                        >
                          <i className="fa fa-download mr-1"></i> Télécharger le
                          fichier
                        </a>{" "}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : null}
                <div className="col-4 mb-4 ">
                  <div className=" ">
                    <div className=" row">
                      {guichetier ? (
                        <>
                          <div className="brand-logo mb-3 mr-4">
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
                          <div className="">
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
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
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
                      </tr>
                    </thead>
                    <tbody>
                      {venteSelected[1].length > 0
                        ? venteSelected[1].map((item, index) => (
                            <tr
                              key={
                                item.produit_code_lot_produit + item.produit.nom_produit
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
                                </div></td>
                              <td className="right">
                                {numberWithCommas(item.prix_vente)}
                              </td>
                              <td className="center">
                                {`${numberWithCommas(
                                  item.quantite_demande
                                )} (${(item.unite.nom_unite)}) `}
                              </td>
                              <td className="right">
                                {numberWithCommas(item.montant_vente)}
                              </td> 
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </table>
                </div>
                {venteSelected[1].length > 0 ? (
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
                                venteSelected[1].reduce(
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
          </div>
        </div>
      </div>
    </>
  );
}

export default View;
