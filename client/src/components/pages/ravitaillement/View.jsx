import React from "react";
import { useRecoilState } from "recoil";
import { ravitaillementSelect } from "../../../atoms/ravitaillement";
import { getData, getUrl } from "../../../utils/utils";

function View() {
  const [rvtSelect, setRvtSelect] = useRecoilState(ravitaillementSelect);
  const [ravitaillement, setRavitaillement] = React.useState({});
  const [listRavitaillementDetails, setListRavitaillementDetails] =
    React.useState([]);
  React.useEffect(() => {
    if (rvtSelect.etat_ravitaillement === "LIVREE")
      getData(
        "ravitaillement",
        (data) => {
          // console.log("data", data);
          setRavitaillement(data[0]);
          setListRavitaillementDetails(data[1]);
        },
        rvtSelect.id
      );
  }, [rvtSelect]);

  const { motif, tva, date_saisi, date_prev_livraison, date_livraison } =
    ravitaillement;

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
        total += item.quantite_livraison * item.prix_unit * (tva / 100);
      });
      return total;
    }
  };

  const getTotalsTTC = () => {
    return getTotalsHT() * (1 + tva / 100);
  };
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
                  setRvtSelect({ id: "", etat_ravitaillement: "" });
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
                <strong>Etat:</strong> LIVREE
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
                    <strong>Date de livraison : </strong>
                    <br />
                    <span>{date_livraison}</span>
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
                      <th className="center">Qte Demandé</th>
                      <th className="center">Qte Livrée</th>
                      <th className="center"></th>
                      <th className="right">Prix Unit</th>
                      <th className="right">Montant HT</th>
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
                            <td className="center">{item.quantite_demande}</td>
                            <td className="center">
                              {item.quantite_livraison}
                            </td>
                            <td className="center">{item.unite.nom_unite}</td>
                            <td className="right">{item.prix_unit}</td>
                            <td className="right">
                              {item.prix_unit * item.quantite_livraison}
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
          </div>
        </div>
      </div>
    </>
  );
}

export default View;
