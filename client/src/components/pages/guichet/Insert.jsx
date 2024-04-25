import React from "react";
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
  getEmplacement,
  numberWithCommas,
  JsonToFormData,
} from "../../../utils/utils";
import {
  isAddState,
  intializeClient,
  intializeOrdonnance,
  intializeVente,
  intializeVenteDetails,
} from "../../../atoms/guichet";
import { useRecoilState } from "recoil";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
function Insert() {
  const [client, setClient] = React.useState(intializeClient);
  const [ordonnance, setOrdonnance] = React.useState(intializeOrdonnance);
  const [vente, setVente] = React.useState(intializeVente);
  const [venteDetails, setVenteDetails] = React.useState(intializeVenteDetails);
  const { nom_prenom, adresse, societe_id } = client;
  const { nom_docteur, hopital } = ordonnance;
  const {
    motif,
    montant_total,
    societe_prise_en_charge,
    guichet_id,
    file_societe,
  } = vente;
  const {
    quantite_demande,
    prix_vente,
    montant_vente,
    unite_vente,
    produit_code_lot_produit,
  } = venteDetails;

  const [isAdd, setIsAdd] = useRecoilState(isAddState);
  const [isObSociete, setIsObSociete] = React.useState(false);
  const [isObOrdonnance, setIsObOrdonnance] = React.useState(false);
  const [isObVtDt, setIsObVtDt] = React.useState(false);
  const [isObGuichet, setIsObGuichet] = React.useState(false);
  const [produit, setProduit] = React.useState({});
  const [societe, setSociete] = React.useState({});
  const [OptionsProduit, setOptionsProduit] = React.useState([]);
  const [vendrePar, setVendrePar] = React.useState({});
  const [OptionsSociete, setOptionsSociete] = React.useState([]);
  const [OptionsGuichet, setOptionsGuichet] = React.useState([]);
  const [OptionsUniteVente, setOptionsUniteVente] = React.useState([]);
  const [file, setFile] = React.useState("");
  const [listVenteDetails, setListVenteDetails] = React.useState([]);
  const [marge_beneficiaire, setMarge_beneficiaire] = React.useState("");
  const [infoVente, setInfoVente] = React.useState("");

  const [showAccordion, setShowAccordion] = React.useState(false);
  const [toggleUniteVente, setToggleUniteVente] = React.useState(true);
  const [unites, setUnites] = React.useState([]);

  const initialize = () => {
    setClient(intializeClient);
    setOrdonnance(intializeOrdonnance);
    setProduit({ label: "", value: "" });
    setSociete({ label: "", value: "" });
    setVente(intializeVente);
    setVenteDetails(intializeVenteDetails);
    setVenteDetails([]);
  };
  const addItemInList = () => {
    if (!produit_code_lot_produit.value || !quantite_demande) {
      setIsObVtDt(true);
      return;
    }
    if (
      listVenteDetails.find(
        (a) => a.produit_code_lot_produit == produit_code_lot_produit.value
      )
    ) {
      toast.warning(
        "Cette produit existe déjà dans la liste; veuillez seulement modifié votre commande dans cette dernière !"
      );
      return;
    }
    setListVenteDetails([
      ...listVenteDetails,
      {
        ...venteDetails,
        ["produit_code_lot_produit"]: produit_code_lot_produit.value,
        ["nom_produit"]: produit.nom_produit,
        ["montant_vente"]: "" + prix_vente * quantite_demande,
        ["unite_stock"]: produit.unite_stock,
        ["unite_presentation"]: produit.unite_presentation,
        ["info"]: infoVente,
        ["unite_vente"]: toggleUniteVente
          ? produit.unite_stock
          : produit.unite_presentation,
      },
    ]);
    produit.nom_produit = '';                   // Pour vider la phrase dans paragraphe info commande
    vendrePar.label = 'Prochaine Commande';     // Pour afficher dans paragraphe info Commande 
    setVenteDetails(intializeVenteDetails)      // Pour initialiser la valeur des commande dans input des formulaire
  };
  const verifObSocieteAndOrdonnance = () => {
    const withOrdonnance = nom_docteur || hopital ? true : false;
    const widhtSociete = file ? true : false;
    if (!withOrdonnance) setIsObOrdonnance(false);
    else setIsObOrdonnance(true);
    if (!widhtSociete) setIsObSociete(false);
    else setIsObSociete(true);
  };
  const getNameUniteById = (id) => {
    return unites.find((a) => a.id === id).nom_unite;
  };
  const add = () => {
    setIsObGuichet(true);
    if (!guichet_id.value) return;
    const withOrdonnance = nom_docteur || hopital ? true : false;
    const widhtSociete = file ? true : false;
    if (listVenteDetails.length <= 0) {
      toast.warning("Ajouter au moins une commande!");
      return;
    }
    verifObSocieteAndOrdonnance();
    if (withOrdonnance) if (verifObligatory(ordonnance)) return;
    if (widhtSociete) if (!societe_id.value || !societe_prise_en_charge) return;
    setVente({
      ...vente,
      montant_total: listVenteDetails.reduce(
        (acc, item) => (acc += parseFloat(item.montant_vente)),
        0
      ),
      date_saisi: getDateNow(),
      unite_vente: toggleUniteVente
        ? produit.unite_stock
        : produit.unite_presentation,
    });
    const dataSendVente = {
      ...vente,
      ["societe_id"]: societe_id.value ? societe_id.value : null,
      montant_total: listVenteDetails.reduce(
        (acc, item) => (acc += parseFloat(item.montant_vente)),
        0
      ),
      date_saisi: getDateNow(),
      ["guichet_id"]: guichet_id.value,
      unite_vente: toggleUniteVente
        ? produit.unite_stock
        : produit.unite_presentation,
    };
    addData(
      "vente/guichet",
      JsonToFormData(
        { vente: dataSendVente, listVenteDetails, client, ordonnance },
        file,
        "file_societe"
      ),
      () => {
        initialize();
        setIsAdd("0");
      },
      true
    );
  };
  const calPrisEnCharge = () => {
    if (!societe_prise_en_charge) return;
    setVenteDetails((prev) => ({
      ...prev,
      prix_vente: Math.round(
        toggleUniteVente
          ? parseFloat(produit.prix_stock) *
              parseFloat(marge_beneficiaire) *
              (1 - parseFloat(societe_prise_en_charge) / 100)
          : (parseFloat(produit.prix_stock) /
              parseFloat(produit.presentation_quantite)) *
              parseFloat(marge_beneficiaire) *
              (1 - parseFloat(societe_prise_en_charge) / 100)
      ),
    }));
  };

  React.useEffect(() => {
    if (produit.emplacement) {
      setVenteDetails((prev) => ({
        ...prev,
        produit_code_lot_produit: {
          label: produit.nom_produit,
          value: produit.code_lot_produit,
        },
        /* prix_vente: Math.round(
          parseFloat(produit.prix_stock) * parseFloat(marge_beneficiaire)
        ),
        quantite_demande: getEmplacement(produit.emplacement)[1]
          .quantite_produit, */
      }));
      console.log(produit);
      /* setVendrePar({
        label: produit.nom_stock,
        value: produit.unite_stock,
      }); */
      setOptionsUniteVente([
        {
          label: produit
            ? getNameUniteById(produit.unite_stock)
            : "Unité de stock",
          value: produit ? produit.unite_stock : "Unité de stock",
        },
        {
          label: produit
            ? getNameUniteById(produit.unite_presentation)
            : "Unité de présentation",
          value: produit ? produit.unite_presentation : "Unité de présentation",
        },
      ]);
      setVendrePar("");
    }
  }, [produit]);
  React.useEffect(() => {
    if (societe) {
      setVente((prev) => ({
        ...prev,
        societe_prise_en_charge: societe.prise_en_charge,
      }));
    }
  }, [societe]);
  React.useEffect(() => {
    if (!produit) return;
    //Vente par unité de stock
    if (vendrePar.value == produit.unite_stock) {
      setToggleUniteVente(true);
      setVenteDetails((prev) => ({
        ...prev,
        ["prix_vente"]: Math.round(
          parseFloat(produit.prix_stock) * parseFloat(marge_beneficiaire)
        ),
      }));
    }
    //Vente par unité de présentation
    else if (vendrePar.value == produit.unite_presentation) {
      setToggleUniteVente(false);
      setVenteDetails((prev) => ({
        ...prev,
        ["prix_vente"]: Math.round(
          (parseFloat(produit.prix_stock) * parseFloat(marge_beneficiaire)) /
            produit.presentation_quantite
        ),
      }));
    }
    console.log(vendrePar.value, " == ", produit.unite_stock);
  }, [vendrePar]);
  //On change **quantite_demande**
  React.useEffect(() => {
    if (!produit || !vendrePar.value) return;
    let info = "Vente " + produit.nom_produit + " : ";
    if (vendrePar.value == produit.unite_stock) {
      setInfoVente(info + quantite_demande + " " + vendrePar.label);
    } else if (vendrePar.value == produit.unite_presentation) {
      if (produit.presentation_quantite > quantite_demande)
        setInfoVente(info + quantite_demande + " " + vendrePar.label);
      else {
        let nbr = 0;
        let reste = quantite_demande;
        for (
          let index = 0;
          index <
          parseFloat(quantite_demande) *
            parseFloat(produit.presentation_quantite);
          index++
        ) {
          if (produit.presentation_quantite > reste) break;
          reste -= produit.presentation_quantite;
          nbr++;
        }
        info += nbr + " " + produit.nom_stock;
        if (reste > 0) info += " et " + reste + " " + produit.nom_presentation;
        // if(info.indexOf('undefined') > -1) info = ""
        setInfoVente(info);
      }
    }
  }, [quantite_demande, vendrePar]);
  React.useEffect(() => {
    if (parseFloat(societe_prise_en_charge) > 1) {
      setIsObSociete(true);
    }
    calPrisEnCharge();
  }, [societe_prise_en_charge, prix_vente, quantite_demande]);
  React.useEffect(() => {
    if (file) {
      setIsObSociete(true);
    }
  }, [file]);
  React.useEffect(() => {
    setListVenteDetails([]);
  }, [societe_prise_en_charge]);
  React.useEffect(() => {
    getData("produitEtalage", (data) => {
      convertToOption(
        data,
        setOptionsProduit,
        "nom_produit",
        "code_lot_produit"
      );
    });
    getData("societeActive", (data) => {
      convertToOption(data, setOptionsSociete);
    });
    getData("guichetActive", (data) => {
      convertToOption(data, setOptionsGuichet);
    });
    getData("unite", (data) => {
      setUnites(data);
    });
    getData("marge_beneficiaire/active", (data) => {
      setMarge_beneficiaire(data.marge_beneficiaire);
    });
  }, []);
  return (
    <>
      <div
        id="accordion-three"
        className="accordion accordion-no-gutter accordion-header-bg"
      >
        <div className="accordion__item">
          <div
            className={
              showAccordion
                ? "accordion__header bg-dark"
                : "accordion__header collapsed"
            }
            onClick={() => {
              setShowAccordion(!showAccordion);
            }}
            aria-expanded="false"
          >
            <span className="accordion__header--text">
              Faire une vente détailée.
            </span>
            <span className="float-right">
              <i className={showAccordion ? "fa fa-minus" : "fa fa-plus"}></i>
            </span>
          </div>
          <div
            id="no-gutter_collapseOne"
            className={
              showAccordion
                ? "accordion__body collapse show"
                : "accordion__body collapse"
            }
            data-parent="#accordion-three"
          >
            <div
              className={
                showAccordion
                  ? "accordion__body--text mt-2 bg-light"
                  : "accordion__body--text mt-2"
              }
              style={{ borderRadius: "2vw" }}
            >
              <InputForm
                textarea
                rows="2"
                name="motif"
                val={motif}
                onChange={(e) => onChange(e, setVente)}
                obligatory={false ? "active" : ""}
                style={{ height: "41px" }}
              >
                Motif de vente
              </InputForm>
              {/* <div className="row">Client</div> */}
              <div className="row">
                <div className="col-xl-3 col-sm-6">
                  <InputForm
                    name="nom_prenom"
                    val={nom_prenom}
                    onChange={(e) => {
                      onChange(e, setClient);
                    }}
                    style={{ height: "41px" }}
                    obligatory={false ? "active" : ""}
                  >
                    Nom et prénom du Client
                  </InputForm>
                </div>
                <div className="col-xl-3 col-sm-6">
                  <InputForm
                    name="adresse"
                    val={adresse}
                    onChange={(e) => onChange(e, setClient)}
                    obligatory={false ? "active" : ""}
                    style={{ height: "41px" }}
                  >
                    Adresse du client
                  </InputForm>
                </div>
                {/* <div className="row">Ordonnance</div> */}
                <div className="col-xl-3 col-sm-6">
                  <InputForm
                    name="nom_docteur"
                    val={nom_docteur}
                    onChange={(e) => {
                      onChange(e, setOrdonnance);
                      verifObSocieteAndOrdonnance();
                    }}
                    style={{ height: "41px" }}
                    obligatory={isObOrdonnance ? "active" : ""}
                  >
                    Nom du Docteur
                  </InputForm>
                </div>
                <div className="col-xl-3 col-sm-6">
                  <InputForm
                    name="hopital"
                    val={hopital}
                    onChange={(e) => {
                      verifObSocieteAndOrdonnance();
                      onChange(e, setOrdonnance);
                    }}
                    style={{ height: "41px" }}
                    obligatory={isObOrdonnance ? "active" : ""}
                  >
                    Hopital
                  </InputForm>
                </div>
              </div>
              {/* <div className="row">Société</div> */}
              <div className="row">
                <div className="col-xl-4 col-sm-6">
                  <SelectForm
                    val={societe_id}
                    value={filterOption(OptionsSociete, societe_id)}
                    options={OptionsSociete}
                    onChange={(e) => {
                      onChange(e, setClient, "societe_id");
                      verifObSocieteAndOrdonnance();
                      if (e.value)
                        getData("societe", (data) => setSociete(data), e.value);
                    }}
                    obligatory={isObSociete ? "active" : ""}
                  >
                    Société
                  </SelectForm>
                </div>
                <div className="col-xl-4 col-sm-6">
                  <InputForm
                    double
                    postIcon={{ text: "%" }}
                    name="societe_prise_en_charge"
                    val={societe_prise_en_charge}
                    onChange={(e) => {
                      onChange(e, setVente);
                      verifObSocieteAndOrdonnance();
                    }}
                    style={{ height: "41px" }}
                    obligatory={isObSociete ? "active" : ""}
                  >
                    Taux prise en charge
                  </InputForm>
                </div>
                <div className="col-xl-4 col-sm-6">
                  <b>Ficher Société</b>
                  <div className="input-group transparent-append mt-1">
                    <input
                      type="file"
                      accept=".jpeg,.png,.jpg,.pdf"
                      className="custom-file-input"
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                        console.log("file", file);
                        verifObSocieteAndOrdonnance();
                      }}
                    />
                    <label className="custom-file-label">
                      {file
                        ? file.name.length > 15
                          ? file.name.slice(0, 25) + "..."
                          : file.name
                        : "Choisissez un ficher"}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr
        className="my-4"
        style={{
          height: 2,
          borderWidth: 0,
          color: "gray",
          backgroundColor: "gray",
        }}
      />
      <div className="d-flex justify-content-between">
        <h4 className="mb-4">Ajouter un produit</h4>
        <p>{infoVente}</p>
      </div>
      <div className="row">
        <div className="col-xl-2 col-sm-4">
          <SelectForm
            val={produit_code_lot_produit}
            value={filterOption(OptionsProduit, produit_code_lot_produit)}
            options={OptionsProduit}
            onChange={(e) => {
              onChange(e, setVenteDetails, "produit_code_lot_produit");
              if (e.value)
                getData("produit", (data) => setProduit(data[0]), e.value);
            }}
            obligatory={isObVtDt ? "active" : ""}
          >
            Produit
          </SelectForm>
        </div>
        <div className="col-xl-2 col-sm-4">
          <SelectForm
            defaultValue=""
            val={vendrePar}
            value={filterOption(OptionsUniteVente, vendrePar)}
            options={OptionsUniteVente}
            onChange={(e) => setVendrePar(e)}
          >
            Vendre par
          </SelectForm>
          <br />
          {/* <span 
            className="badge badge-yass badge-xl light badge-dark mt-1 w-100"
            onClick={() => {
              if (produit) setToggleUniteVente(!toggleUniteVente);
            }}
          >
            {!toggleUniteVente
              ? produit.unite_stock
                ? getNameUniteById(produit.unite_stock)
                : "Stock"
              : produit.unite_presentation
              ? getNameUniteById(produit.unite_presentation)
              : "Présentation"}
          </span> */}
        </div>
        {/* <div className="col-xl-2 col-sm-4">
          <InputForm
            // postIcon={{ text: "Ar" }}
            number
            name="prix_vente"
            val={prix_vente}
            onChange={(e) => onChange(e, setVenteDetails)}
            obligatory={isObVtDt ? "active" : ""}
            style={{ height: "41px" }}
            
          >
            Prix Unitaire
          </InputForm>
        </div> */}
        <div className="col-xl-2 col-sm-4">
          <span className="font-w600 mb-1 w-100">Prix Unitaire</span>
          <br />
          <span
            style={{ height: "41px", paddingTop: "2.5px" }}
            className="badge badge-xl light badge-info mt-1 w-100"
          >
            {prix_vente
              ? numberWithCommas(prix_vente)
              : "0" + " Ar"}
          </span>
        </div>
        <div className="col-xl-2 col-sm-4">
          <InputForm
            double
            mini={0}
            maxi={
              produit.emplacement
                ? toggleUniteVente
                  ? getEmplacement(produit.emplacement)[1].quantite_produit
                  : getEmplacement(produit.emplacement)[1].quantite_produit *
                    produit.presentation_quantite
                : "0"
            }
            // postIcon={{
            //   text: toggleUniteVente
            //     ? produit.unite_stock
            //       ? getNameUniteById(produit.unite_stock)
            //       : "Stock"
            //     : produit.unite_presentation
            //     ? getNameUniteById(produit.unite_presentation)
            //     : "Présentation",
            // }}
            name="quantite_demande"
            val={quantite_demande}
            onChange={(e) => onChange(e, setVenteDetails)}
            obligatory={isObVtDt ? "active" : ""}
            style={{ height: "41px" }}
          >
            Quantité
          </InputForm>
        </div>
        <div className="col-xl-2 col-sm-4">
          <span className="font-w600 mb-1 w-100">Montant</span>
          <br />
          <span
            style={{ height: "41px", paddingTop: "2.5px" }}
            className="badge badge-xl light badge-warning mt-1 w-100"
          >
            {quantite_demande && prix_vente
              ? numberWithCommas(prix_vente * quantite_demande)
              : "0" + " Ar"}
          </span>
        </div>
        <div className="col-xl-2 col-sm-4 align-items-center">
          <ButtonTable
            style={{ height: "41px", marginTop: "2.25vh" }}
            importance="success  w-100"
            handleClick={addItemInList}
          >
            Ajouter
          </ButtonTable>
        </div>
      </div>
      <hr
        className="mb-4"
        style={{
          height: 2,
          borderWidth: 0,
          color: "gray",
          backgroundColor: "gray",
        }}
      />
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-3">Liste des produits ajoutés</h4>
          <div className="row align-items-center ">
            <span className="mr-4 font-w600">Choisissez votre poste : </span>
            <SelectForm
              val={guichet_id}
              defaultValue={
                OptionsGuichet[0]
                  ? OptionsGuichet[0]
                  : { label: "Choisissez un guichet", value: "0" }
              }
              value={filterOption(OptionsGuichet, guichet_id)}
              options={OptionsGuichet}
              onChange={(e) => {
                onChange(e, setVente, "guichet_id");
              }}
              obligatory={isObGuichet ? "active" : ""}
              style={{ widht: "30%" }}
            />
          </div>
        </div>
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
              {listVenteDetails.length > 0
                ? listVenteDetails.map((item, index) => (
                    <tr key={item.produit_code_lot_produit + item.nom_produit}>
                      <td className="center">{++index}</td>
                      <td className="left strong">
                        {item.produit_code_lot_produit}
                      </td>
                      <td className="left">
                        <div className="">
                          <p>{item.nom_produit}</p>
                          <hr
                            style={{ marginTop: "-12px", marginBottom: "6px" }}
                            className="border border-secondary"
                          />
                          <span>{item.info}</span>
                        </div>
                      </td>
                      <td className="right">
                        {numberWithCommas(item.prix_vente)}
                      </td>
                      <td className="center">
                        {`${numberWithCommas(
                          item.quantite_demande
                        )} (${getNameUniteById(item.unite_vente)}) `}
                      </td>
                      <td className="right">
                        {numberWithCommas(item.montant_vente)}
                      </td>
                      <th className="center">
                        {/* <ButtonTable
                          importance="warning"
                          icon={faEdit}
                          handleClick={() => {
                            setVenteDetails({ ...intializeVenteDetails });
                            getData(
                              "produit",
                              (data) => setProduit(data[0]),
                              item.produit_code_lot_produit
                            );
                            setVenteDetails({
                              prix_vente: item.prix_vente,
                              quantite_demande: item.quantite_demande,
                              montant_vente: item.montant_vente,
                              produit_code_lot_produit: {
                                label: item.nom_produit,
                                value: item.produit_code_lot_produit,
                              },
                            });
                            console.log({
                              ...intializeVenteDetails,
                              produit_code_lot_produit: {
                                label: item.nom_produit,
                                value: item.produit_code_lot_produit,
                              },
                            });
                            setListVenteDetails([
                              ...listVenteDetails.slice(
                                0,
                                listVenteDetails.indexOf(item)
                              ),
                              ...listVenteDetails.slice(
                                listVenteDetails.indexOf(item) + 1
                              ),
                            ]);
                          }}
                        /> */}
                        <ButtonTable
                          importance="danger"
                          icon={faTrash}
                          handleClick={() => {
                            confirmDelete(
                              "Retirer cet élément de la liste des commandes?",
                              () => {
                                setListVenteDetails([
                                  ...listVenteDetails.slice(
                                    0,
                                    listVenteDetails.indexOf(item)
                                  ),
                                  ...listVenteDetails.slice(
                                    listVenteDetails.indexOf(item) + 1
                                  ),
                                ]);
                              }
                            );
                          }}
                        />
                      </th>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
        {listVenteDetails.length > 0 ? (
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
                          listVenteDetails.reduce(
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
      <div className="">
        <div className="row">
          <div className="col-xl-2 col-sm-4">
            <button
              className="btn btn-info light btn-lg w-100 "
              data-toggle="tooltip"
              data-placement="top"
              title="Listes des commandes vente"
              onClick={() => {
                setIsAdd("0");
              }}
            >
              <i className="fa fa-list-alt"></i>
            </button>
          </div>
          <div className="col-xl-3 col-sm-4">
            <button
              className="btn btn-danger light btn-lg w-100 "
              onClick={() => {
                initialize();
                window.location.reload();
              }}
            >
              Annuler
            </button>
          </div>
          <div className="col-xl-7 col-sm-4">
            <button
              className="btn btn-success light btn-lg w-100 "
              onClick={() => {add()}}
            >
              Efféctuer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Insert;
