import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  addData,
  getData,
  getUrl,
  InputForm,
  updateData,
  onChange,
  convertToOption,
  confirmDelete,
  SelectForm,
  getClassByNumber,
  ButtonTable,
  filterOption,
  getDateNow,
} from "../../../utils/utils";
import { isAddState, listAjustement } from "../../../atoms/ajustement";
import { faAdd, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function Modal() {
  const initializeAjt = {
    motif: "",
    date_saisi: "",
    date_ajustement: "",
  };
  const initializeAjtDt = {
    quantite_nouveau_stock: "",
    quantite_nouveau_presentation: "",
    unite_nouveau_stock: { value: "", label: "" },
    unite_nouveau_presentation: { value: "", label: "" },
    produit_code_lot_produit: { value: "", label: "" },
  };
  const [isAdd, setIsAdd] = useRecoilState(isAddState);
  const [list, setList] = useRecoilState(listAjustement);
  const [confirmAjt, setConfirmAjt] = React.useState(false);
  const [isObAjt, setIsObAjt] = React.useState(false);
  const [isObAjtDt, setIsObAjtDt] = React.useState(false);
  const [ajustement, setAjustement] = useState(initializeAjt);
  const [ajustementDetails, setAjustementDetails] = useState(initializeAjtDt);
  const [_produit, set_Produit] = useState({});
  const [listAjustementDetails, setListAjustementDetails] = useState([]);
  const [OptionsProduit, setOptionsProduit] = useState([]);
  const [OptionsUniteStock, setOptionsUniteStock] = useState([]);
  const [OptionsUnitePresentation, setOptionsUnitePresentation] = useState([]);
  const { motif, date_saisi, date_ajustement } = ajustement;
  const {
    quantite_nouveau_stock,
    quantite_nouveau_presentation,
    unite_nouveau_stock,
    unite_nouveau_presentation,
    produit_code_lot_produit,
  } = ajustementDetails;

  const addItemInTable = () => {
    setIsObAjtDt(true);
    /* console.log("ajustementDetails",{
      ...ajustementDetails,
      produit_code_lot_produit: produit_code_lot_produit.value,
      nom_produit: _produit.nom_produit,
      unite_nouveau_presentation: unite_nouveau_presentation.value,
      unite_nouveau_stock: unite_nouveau_stock.value,
      unite_ancien_presentation: _produit.unite_presentation,
      unite_ancien_stock: _produit.unite_stock,
      quantite_ancien_presentation: _produit.presentation_quantite,
      quantite_ancien_stock: _produit.quantite_stock,
    }); */
    if (
      !unite_nouveau_presentation.value ||
      !unite_nouveau_stock.value ||
      !quantite_nouveau_presentation ||
      !quantite_nouveau_stock
    )
      return;
    let verif = false;
    Object.entries(listAjustementDetails).forEach(([key, value]) => {
      if (value.produit_code_lot_produit === _produit.code_lot_produit)
        verif = true;
    });
    if (verif) {
      toast.warning(
        "Cette produit existe déjà dans la liste; veuillez seulement modifié cette dernière ?"
      );
      return;
    }
    setListAjustementDetails([
      ...listAjustementDetails,
      {
        ...ajustementDetails,
        produit_code_lot_produit: produit_code_lot_produit.value,
        nom_produit: _produit.nom_produit,
        unite_nouveau_presentation: unite_nouveau_presentation.value,
        unite_nouveau_stock: unite_nouveau_stock.value,
        unite_ancien_presentation: _produit.unite_presentation,
        unite_ancien_stock: _produit.unite_stock,
        quantite_ancien_presentation: _produit.presentation_quantite,
        quantite_ancien_stock: _produit.quantite_stock,
      },
    ]);
  };
  const ajuster = () => {
    console.log('listAjustementDetails', listAjustementDetails)
    addData(
      "ajustement",
      {
        dataAjt: { ...ajustement, date_saisi: getDateNow() },
        dataAjtDetail: listAjustementDetails,
      },
      () => {
        getData("ajustement", setList);
        setAjustement(initializeAjt);
        setAjustementDetails(initializeAjtDt);
        setListAjustementDetails([]);
        document.getElementById("closeModalAjustement").click();
        setConfirmAjt(false);
        setIsAdd("0");
      }
    );
  };
  const add = () => {
    setIsObAjt(true);
    if (!motif) {
      toast.warning("Entrer la motif de l'ajustement.");
      return;
    }
    if (!date_ajustement) {
      toast.warning("Entrer la date de l'ajustement.");
      return;
    }
    if (listAjustementDetails.length < 0) {
      toast.warning("Ajouter au moins un produit.");
      return;
    }
    setConfirmAjt(true);
  };
  const getNameUniteById = (id) => {
    return OptionsUniteStock.find((a) => a.value === id).label;
  };
  useEffect(() => {
    getData("ProduitNonPerime", (data) => {
      convertToOption(
        data,
        setOptionsProduit,
        "nom_produit",
        "code_lot_produit"
      );
    });
    getData("unite", (data) => {
      convertToOption(data, setOptionsUniteStock);
    });
    getData("unite", (data) => {
      convertToOption(data, setOptionsUnitePresentation);
    });
  }, []);
  return (
    <>
      <button
        className="d-none"
        id="btnModalAjustementConfirm"
        data-toggle="modal"
        data-target="#modalAjustementConfirm"
      >
        valider
      </button>
      <>
        <div
          className="modal fade "
          id="modalAjustementConfirm"
          style={{ display: "none" }}
          aria-modal="true"
          data-keyboard="true"
        >
          <div className="modal-dialog  modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ajustement</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  Cette opération modifiera votre quantité de stock( et sa
                  présentation (avec leur unité)); de ce fait les quantités
                  étalées seront supprimées et les nouvelles informations seront
                  dans le dépôt principal.\n Voulez-vous vraiment continuez?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={ajuster}
                >
                  Ajuster
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  data-dismiss="modal"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
      <div
        className="modal fade"
        id="modalAjustement"
        style={{ display: "none" }}
        aria-modal="true"
        data-backdrop="static"
        data-keyboard="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Effectuer un ajustement</h5>
              <button
                type="button"
                className="close"
                id="closeModalAjustement"
                data-dismiss="modal"
                onClick={() => {
                  setIsObAjt(false);
                  setIsObAjtDt(false);
                  setIsAdd("0");
                }}
              >
                <span>×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-xl-9 col-sm-8">
                  <InputForm
                    name="motif"
                    val={motif}
                    onChange={(e) => onChange(e, setAjustement)}
                    obligatory={isObAjt ? "active" : ""}
                  >
                    Motif de l'ajustement
                  </InputForm>
                </div>
                <div className="col-xl-3 col-sm-4">
                  <InputForm
                    date
                    name="date_ajustement"
                    val={date_ajustement}
                    onChange={(e) => onChange(e, setAjustement)}
                    obligatory={isObAjt ? "active" : ""}
                  >
                    Date de l'ajustement
                  </InputForm>
                </div>
              </div>
              <div className=" row">
                <div className="col-xl-4 col-sm-4">
                  <SelectForm
                    val={produit_code_lot_produit}
                    value={filterOption(
                      OptionsProduit,
                      produit_code_lot_produit
                    )}
                    options={OptionsProduit}
                    onChange={(e) => {
                      onChange(
                        e,
                        setAjustementDetails,
                        "produit_code_lot_produit"
                      );
                      if (e.value)
                        getData(
                          "produit",
                          (data) => set_Produit(data[0]),
                          e.value
                        );
                    }}
                    obligatory={isObAjtDt ? "active" : ""}
                  >
                    Produit
                  </SelectForm>
                </div>
                <div className="col-xl-2 col-sm-4">
                  <InputForm
                    double
                    name="quantite_nouveau_stock"
                    val={quantite_nouveau_stock}
                    onChange={(e) => onChange(e, setAjustementDetails)}
                    obligatory={isObAjtDt ? "active" : ""}
                  >
                    Nouv. Qte stock
                  </InputForm>
                </div>
                <div className="col-xl-2 col-sm-4">
                  <SelectForm
                    val={unite_nouveau_stock}
                    value={filterOption(OptionsUniteStock, unite_nouveau_stock)}
                    options={OptionsUniteStock}
                    onChange={(e) => {
                      onChange(e, setAjustementDetails, "unite_nouveau_stock");
                    }}
                    obligatory={isObAjtDt ? "active" : ""}
                  >
                    Unité Stock
                  </SelectForm>
                </div>
                <div className="col-xl-2 col-sm-4">
                  <InputForm
                    double
                    name="quantite_nouveau_presentation"
                    val={quantite_nouveau_presentation}
                    onChange={(e) => onChange(e, setAjustementDetails)}
                    obligatory={isObAjtDt ? "active" : ""}
                  >
                    Nouv. Qte présentation
                  </InputForm>
                </div>
                <div className="col-xl-2 col-sm-4">
                  <SelectForm
                    val={unite_nouveau_presentation}
                    value={filterOption(
                      OptionsUnitePresentation,
                      unite_nouveau_presentation
                    )}
                    options={OptionsUnitePresentation}
                    onChange={(e) => {
                      onChange(
                        e,
                        setAjustementDetails,
                        "unite_nouveau_presentation"
                      );
                    }}
                    obligatory={isObAjtDt ? "active" : ""}
                  >
                    Unité Pres.
                  </SelectForm>
                </div>
              </div>
              {produit_code_lot_produit.value ? (
                <div className="row m-auto align-items-center">
                  <div className="col-xl-4 col-sm-12 sm:m-1">
                    <span className="badge badge-dark light w-100  xl:badge-xl row">
                      <span
                        className={
                          "badge badge-" +
                          getClassByNumber(
                            parseFloat(_produit.quantite_stock)
                          ) +
                          " light col-8 xl:mr-2"
                        }
                      >
                        Stock : {_produit.quantite_stock}
                      </span>
                      <span
                        className={
                          "badge badge-" +
                          getClassByNumber(
                            parseFloat(_produit.quantite_stock)
                          ) +
                          " col-4 mr-2"
                        }
                      >
                        {_produit.nom_stock}
                      </span>
                    </span>
                  </div>
                  <div className="col-xl-4 col-sm-12 sm:m-1">
                    <span className="badge badge-dark light xl:badge-xl w-100 row mr-2">
                      <span
                        className={
                          "badge badge-" +
                          getClassByNumber(
                            parseFloat(_produit.quantite_presentation)
                          ) +
                          " light col-8 xl:mr-2"
                        }
                      >
                        Présentation : {_produit.presentation_quantite}
                      </span>
                      <span
                        className={
                          "badge badge-" +
                          getClassByNumber(
                            parseFloat(_produit.quantite_presentation)
                          ) +
                          "  col-4 xl:mr-2"
                        }
                      >
                        {_produit.nom_presentation}
                      </span>
                    </span>
                  </div>
                  <div className="col-xl-4 col-sm-12 sm:m-1">
                    <ButtonTable
                      importance="warning light w-100 "
                      icon={faAdd}
                      handleClick={addItemInTable}
                    >
                      &nbsp;&nbsp;&nbsp;Ajouter
                    </ButtonTable>
                  </div>
                </div>
              ) : null}
              <div className="my-4">
                <div className="table-responsive">
                  <table className="table table-striped table-responsive-md">
                    <thead>
                      <tr>
                        <th className="center">#</th>
                        <th>Code</th>
                        <th>Produit</th>
                        <th className="right">De</th>
                        <th className="center">A</th>
                        <th style={{ widht: "100px" }} className="center">
                          Option
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {listAjustementDetails.map((item) => (
                        <tr
                          key={item.produit_code_lot_produit + item.nom_produit}
                        >
                          <td className="center">1</td>
                          <td className="left strong">
                            {item.produit_code_lot_produit}
                          </td>
                          <td className="left">{item.nom_produit}</td>
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
                          <th className="center">
                            {/* <ButtonTable
                            importance="warning"
                            icon={faEdit}
                            handleClick={() => { 
                              setAjustementDetails(initializeAjtDt)
                              setAjustementDetails({
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
                              setListAjustementDetails([
                                ...listAjustementDetails.slice(
                                  0,
                                  listAjustementDetails.indexOf(item)
                                ),
                                ...listAjustementDetails.slice(
                                  listAjustementDetails.indexOf(item) + 1
                                ),
                              ]);
                            }}
                          /> */}
                            <ButtonTable
                              importance="danger"
                              icon={faTrash}
                              handleClick={() => {
                                setListAjustementDetails([
                                  ...listAjustementDetails.slice(
                                    0,
                                    listAjustementDetails.indexOf(item)
                                  ),
                                  ...listAjustementDetails.slice(
                                    listAjustementDetails.indexOf(item) + 1
                                  ),
                                ]);
                                // confirmDelete(
                                //   "Retirer cet élément de la liste des commandes ?",
                                //   () => {
                                //   }
                                // );
                              }}
                            />
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                {confirmAjt ? (
                  <div className="alert alert-warning" role="alert">
                    Cette opération modifiera votre quantité de stock( et sa
                    présentation (avec leur unité)); de ce fait les quantités
                    étalées seront supprimées et les nouvelles informations
                    seront dans le dépôt principal. Voulez-vous vraiment
                    continuez?
                    <br />
                    <br />
                    <div className="float-right">
                      <button
                        type="button"
                        className="btn btn-light mr-2 "
                        onClick={() => {
                          setConfirmAjt(false);
                        }}
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        className="btn btn-success "
                        onClick={ajuster}
                      >
                        Valider
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-danger light"
                      data-dismiss="modal"
                      onClick={() => {
                        setIsObAjt(false);
                        setIsAdd("0");
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={add}
                    >
                      Valider
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
