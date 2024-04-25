import React from "react";
import { useRecoilState } from "recoil";
import {
  isAddState,
  listProduit,
  produitSelect,
  initialize,
} from "../../../atoms/produit";
import {
  addData,
  getData,
  getUrl,
  InputForm,
  updateData,
  onChange,
  SelectForm,
  convertToOption,
  verifObligatory,
  JsonToFormData,
  getDateNow,
} from "../../../utils/utils";

function Modal() {
  const [isAdd, setIsAdd] = useRecoilState(isAddState);
  const [list, setList] = useRecoilState(listProduit);
  const [produitSelected, setProduitSelected] = useRecoilState(produitSelect);
  const [produit, setProduit] = React.useState(initialize);
  const [isOb, setIsOb] = React.useState(false);
  const [OptionsUnite, setOptionsUnite] = React.useState([]);
  const [OptionsForme, setOptionsForme] = React.useState([]);
  const [OptionsFabricant, setOptionsFabricant] = React.useState([]);
  const [OptionsFamille, setOptionsFamille] = React.useState([]);
  const [OptionsVoie, setOptionsVoie] = React.useState([]);
  const [preview, setPreview] = React.useState("");
  const [img, setImg] = React.useState(null);
  const closeRef = React.useRef();
  const inputRef = React.useRef();
  const filterOption = (option, optionSelect) =>
    JSON.stringify(option) === JSON.stringify(optionSelect);

  const {
    code_lot_produit,
    nom_produit,
    classification_produit,
    description,
    image,
    presentation_quantite,
    prix_stock,
    stock_min,
    stock_max,
    date_peremption,
    quantite_stock,
    // date_der_ravitaillement ,
    fabricant_id,
    famille_id,
    forme_id,
    voie_id,
    unite_presentation,
    unite_achat,
    unite_vente,
    unite_stock,
  } = produit;

  const handleClickInput = () => {
    setIsOb(false);
    inputRef.current.click();
  };

  const getAll = () => {
    getData("produit", setList);
    closeModal();
  };

  const closeModal = () => {
    setIsAdd({ status: true });
    setIsOb(false);
    setPreview("");
    setProduit(initialize);
    setProduitSelected(initialize);
    closeRef.current.click();
  };

  const add = () => {
    let dataSend = {
      ...produit,
      ["fabricant_id"]: fabricant_id.value,
      ["famille_id"]: famille_id.value,
      ["forme_id"]: forme_id.value,
      ["voie_id"]: voie_id.value,
      ["unite_achat"]: unite_achat.value,
      ["unite_presentation"]: unite_presentation.value,
      ["unite_stock"]: unite_stock.value,
      ["unite_vente"]: unite_vente.value,
    };
    console.log(
      "dataSend",
      dataSend,
      verifObligatory(dataSend, [
        "image",
        "description",
        "classification_produit",
        "voie_id",
        "date_der_ravitaillement",
      ])
    );
    if (
      verifObligatory(dataSend, [
        "image",
        "description",
        "classification_produit",
        "voie_id",
        "date_der_ravitaillement",
      ])
    )
      return;
    addData("produit", JsonToFormData(dataSend, img, "image"), getAll, true);
  };
  const update = () => {
    let dataSend = {
      ...produit,
      ["fabricant_id"]: fabricant_id.value,
      ["famille_id"]: famille_id.value,
      ["forme_id"]: forme_id.value,
      ["voie_id"]: voie_id.value,
      ["unite_achat"]: unite_achat.value,
      ["unite_presentation"]: unite_presentation.value,
      ["unite_stock"]: unite_stock.value,
      ["unite_vente"]: unite_vente.value,
    };
    if (
      verifObligatory(dataSend, [
        "image",
        "description",
        "classification_produit",
        "voie_id",
        "date_der_ravitaillement",
        "deletedAt",
      ])
    )
      return;
    updateData(
      "produit",
      produitSelected.code_lot_produit,
      JsonToFormData(dataSend, img, "image"),
      getAll,
      true
    );
  };

  const getDetailsQte = (_produit) => {
    // console.log("getDetailsQte _produit", _produit);
    return (
      <>
        {_produit["famille_id"]["label"] ? (
          <>
            Appartient au famillle{" "}
            <strong>{_produit["famille_id"]["label"]}</strong>.<br />
          </>
        ) : (
          ""
        )}
        {_produit["forme_id"]["label"] ? (
          <>
            De forme <strong>{_produit["forme_id"]["label"]}</strong>.<br />
          </>
        ) : (
          ""
        )}
        {_produit["voie_id"]["label"] ? (
          <>
            Voie de consommation <strong>{_produit["voie_id"]["label"]}</strong>
            .<br />
          </>
        ) : (
          ""
        )}
        {_produit["quantite_stock"] ? (
          <>
            Le produit est au nombre de{" "}
            <strong>{_produit["quantite_stock"]}</strong>{" "}
          </>
        ) : (
          ""
        )}
        {_produit.unite_stock["label"] && _produit.quantite_stock ? (
          <>
            {" "}
            <strong>{_produit.unite_stock["label"]}</strong>{" "}
          </>
        ) : (
          ""
        )}
        {_produit.presentation_quantite && _produit.quantite_stock ? (
          <>
            {" "}
            avec{" "}
            <strong>
              {_produit.quantite_stock * _produit.presentation_quantite}
            </strong>{" "}
          </>
        ) : (
          ""
        )}
        {_produit.unite_presentation["label"] &&
        _produit.presentation_quantite &&
        _produit.quantite_stock ? (
          <>
            {" "}
            <strong>{_produit.unite_presentation["label"]}</strong>.
          </>
        ) : (
          ""
        )}

        {_produit.presentation_quantite &&
        // _produit["quantite_stock"].value &&
        // _produit["unite_stock"].value &&
        // _produit.unite_vente.value &&
        _produit["unite_presentation"].value &&
        _produit.quantite_stock ? (
          <>
            <br />
            Quantité dispo pour le vente(que l'on peut étalé) sera{" "}
            <strong>
              {getQteVente(_produit) + " " + _produit.unite_vente.label}
            </strong>
            .
          </>
        ) : (
          ""
        )}
      </>
    );
  };

  const getQteVente = (_produit) => {
    let qt_vente = _produit.quantite_stock;
    if (
      _produit.presentation_quantite &&
      // _produit["quantite_stock"].value &&
      // _produit["unite_stock"].value &&
      // _produit.unite_vente.value &&
      _produit["unite_presentation"].value
    ) {
      if (_produit.unite_vente.value === _produit.unite_presentation.value) {
        qt_vente = _produit.quantite_stock * _produit.presentation_quantite;
      } else if (_produit.unite_vente.value === _produit.unite_stock.value) {
        qt_vente = _produit.quantite_stock;
      }
    }
    return qt_vente;
  };

  React.useEffect(() => {
    getData("Unite", (data) => convertToOption(data, setOptionsUnite));
    getData("Fabricant", (data) => convertToOption(data, setOptionsFabricant));
    getData("Famille", (data) => convertToOption(data, setOptionsFamille));
    getData("Forme", (data) => convertToOption(data, setOptionsForme));
    getData("Voie", (data) => convertToOption(data, setOptionsVoie));
  }, []);

  React.useEffect(() => {
    if (img) setPreview(URL.createObjectURL(img));
  }, [img]);

  React.useEffect(() => {
    if (isAdd.status) {
      setIsOb(false);
      setPreview("");
      setProduit(initialize);
    }
  }, [isAdd]);
  const dbToEditProduit = (produitSelected) => {
    const idToOption = (value, label) => {
      return { label: label, value: value };
    };
    return {
      ...produitSelected,
      ["fabricant_id"]: idToOption(
        produitSelected.fabricant_id,
        produitSelected.nom_fabricant
      ),
      ["famille_id"]: idToOption(
        produitSelected.famille_id,
        produitSelected.nom_famille
      ),
      ["forme_id"]: idToOption(
        produitSelected.forme_id,
        produitSelected.nom_forme
      ),
      ["voie_id"]: idToOption(
        produitSelected.voie_id,
        produitSelected.nom_voie
      ),
      ["unite_presentation"]: idToOption(
        produitSelected.unite_presentation,
        produitSelected.nom_presentation
      ),
      ["unite_achat"]: idToOption(
        produitSelected.unite_achat,
        produitSelected.nom_achat
      ),
      ["unite_vente"]: idToOption(
        produitSelected.unite_vente,
        produitSelected.nom_vente
      ),
      ["unite_stock"]: idToOption(
        produitSelected.unite_stock,
        produitSelected.nom_stock
      ),
    };
  };

  React.useEffect(() => {
    // console.log("produitSelected", produitSelected);
    if (produitSelected) {
      setProduit(dbToEditProduit(produitSelected));
      // console.log("produit select", produit);
      if (produitSelected.image)
        setPreview(getUrl("images/produit", produitSelected.image));
    }
  }, [produitSelected]);

  React.useEffect(() => {
    let qtt_stock = quantite_stock;
    if (presentation_quantite && quantite_stock) {
      if (unite_achat === unite_stock) {
        qtt_stock = quantite_stock * presentation_quantite;
        setProduit((prevState) => ({
          ...prevState,
          ["quantite_stock"]: qtt_stock,
        }));
        setProduit((prevState) => ({
          ...prevState,
          ["quantite_stock"]: qtt_stock,
        }));
      }
    }
  }, [presentation_quantite, quantite_stock, unite_presentation]);

  return (
    <>
      <div
        className="modal fade"
        id="modalProduit"
        style={{ display: "none" }}
        aria-modal="true"
        data-backdrop="static"
        data-keyboard="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isAdd.status ? "Ajouter" : "Modifier"} un produit
              </h5>
              <button
                ref={closeRef}
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={closeModal}
              >
                <span>×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row mb-3">
                <span className="float-left w-50 ml-4">
                  {getDetailsQte(produit)}
                </span>
                <img
                  style={{ width: "auto", height: "15vh", borderRadius: "2%" }}
                  src={preview ? preview : "images/product/1.jpg"}
                  alt="Image"
                  className="rounded mx-auto d-block shadow-sm text-center "
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Cliqué ici pour changer l'image"
                  onClick={handleClickInput}
                />
                <input
                  type="file"
                  accept=".jpg,.png,.jpeg"
                  className="d-none"
                  ref={inputRef}
                  onChange={(e) => setImg(e.target.files[0])}
                />
              </div>
              <div className="row">
                {isAdd.status ? (
                  <div className="col-3">
                    <InputForm
                      preIcon={{ text: "#" }}
                      name="code_lot_produit"
                      val={code_lot_produit}
                      onChange={(e) => onChange(e, setProduit)}
                      obligatory={isOb ? "active" : ""}
                    >
                      Code lot produit
                    </InputForm>
                  </div>
                ) : null}
                <div className="col-3">
                  <InputForm
                    date 
                    min={getDateNow("date")} 
                    name="date_peremption"
                    val={date_peremption}
                    onChange={(e) => onChange(e, setProduit)}
                    obligatory={isOb ? "active" : ""}
                  >
                    Date de péremption
                  </InputForm>
                </div>

                <div className="col ">
                  <InputForm
                    name="nom_produit"
                    val={nom_produit}
                    onChange={(e) => onChange(e, setProduit)}
                    obligatory={isOb ? "active" : ""}
                  >
                    Désignation
                  </InputForm>
                </div>
                {!isAdd.status ? (
                  <div className="col-4">
                    <InputForm
                      integer
                      postIcon={{ text: "Ar" }}
                      name="prix_stock"
                      val={prix_stock}
                      onChange={(e) => onChange(e, setProduit)}
                      obligatory={isOb ? "active" : ""}
                    >
                      Prix de stock {/* ( * tva : prix de vente) */}
                    </InputForm>
                  </div>
                ) : (
                  ""
                )}
              </div>
              {isAdd.status ? (
                <>
                  <div className="row">
                    <div className="col-3">
                      <InputForm
                        integer
                        postIcon={{ text: "Quantité" }}
                        name="quantite_stock"
                        val={quantite_stock}
                        onChange={(e) => onChange(e, setProduit)}
                        obligatory={isOb ? "active" : ""}
                      >
                        Stock
                      </InputForm>
                    </div>
                    <div className="col-3">
                      <SelectForm
                        val={unite_stock}
                        value={OptionsUnite.filter((option) =>
                          filterOption(option, unite_stock)
                        )}
                        onChange={(e) => onChange(e, setProduit, "unite_stock")}
                        options={OptionsUnite}
                        obligatory={isOb ? "active" : ""}
                      >
                        Unité de stock
                      </SelectForm>
                    </div>
                    <div className="col-3">
                      <InputForm
                        integer
                        postIcon={{ text: "Quatité" }}
                        name="presentation_quantite"
                        val={presentation_quantite}
                        onChange={(e) => onChange(e, setProduit)}
                        obligatory={isOb ? "active" : ""}
                      >
                        Présentation
                      </InputForm>
                    </div>
                    <div className="col-3">
                      <SelectForm
                        //   postIcon={{"text": "Unité"}}
                        val={unite_presentation}
                        value={OptionsUnite.filter((option) =>
                          filterOption(option, unite_presentation)
                        )}
                        onChange={(e) =>
                          onChange(e, setProduit, "unite_presentation")
                        }
                        options={OptionsUnite}
                        obligatory={isOb ? "active" : ""}
                      >
                        Unité de présentation
                      </SelectForm>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4">
                      <SelectForm
                        val={unite_vente}
                        value={OptionsUnite.filter((option) =>
                          filterOption(option, unite_vente)
                        )}
                        onChange={(e) => onChange(e, setProduit, "unite_vente")}
                        options={OptionsUnite}
                        obligatory={isOb ? "active" : ""}
                      >
                        Unité de vente
                      </SelectForm>
                    </div>
                    <div className="col-4">
                      <InputForm
                        integer
                        postIcon={{ text: "Ar" }}
                        name="prix_stock"
                        val={prix_stock}
                        onChange={(e) => onChange(e, setProduit)}
                        obligatory={isOb ? "active" : ""}
                      >
                        Prix de stock {/* ( * tva : prix de vente) */}
                      </InputForm>
                    </div>
                    <div className="col-4">
                      <SelectForm
                        val={unite_achat}
                        value={OptionsUnite.filter((option) =>
                          filterOption(option, unite_achat)
                        )}
                        onChange={(e) => onChange(e, setProduit, "unite_achat")}
                        options={OptionsUnite}
                        obligatory={isOb ? "active" : ""}
                      >
                        Unité d'achat
                      </SelectForm>
                    </div>
                  </div>{" "}
                </>
              ) : null}
              <div className="row">
                <div className="col-4">
                  <SelectForm
                    val={fabricant_id}
                    value={OptionsFabricant.filter((option) =>
                      filterOption(option, fabricant_id)
                    )}
                    onChange={(e) => onChange(e, setProduit, "fabricant_id")}
                    options={OptionsFabricant}
                    obligatory={isOb ? "active" : ""}
                  >
                    Fabricant
                  </SelectForm>
                </div>
                <div className="col-4">
                  <SelectForm
                    val={famille_id}
                    value={OptionsFamille.filter((option) =>
                      filterOption(option, famille_id)
                    )}
                    onChange={(e) => onChange(e, setProduit, "famille_id")}
                    options={OptionsFamille}
                    obligatory={isOb ? "active" : ""}
                  >
                    Famille
                  </SelectForm>
                </div>
                <div className="col-4">
                  <SelectForm
                    val={forme_id}
                    value={OptionsForme.filter((option) =>
                      filterOption(option, forme_id)
                    )}
                    onChange={(e) => onChange(e, setProduit, "forme_id")}
                    options={OptionsForme}
                    obligatory={isOb ? "active" : ""}
                  >
                    Forme
                  </SelectForm>
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <SelectForm
                    val={voie_id}
                    value={OptionsVoie.filter((option) =>
                      filterOption(option, voie_id)
                    )}
                    onChange={(e) => onChange(e, setProduit, "voie_id")}
                    options={OptionsVoie}
                    obligatory={isOb ? "active" : ""}
                  >
                    Voie
                  </SelectForm>
                </div>
                <div className="col-4">
                  <InputForm
                    integer
                    name="stock_min"
                    val={stock_min}
                    onChange={(e) => onChange(e, setProduit)}
                    obligatory={isOb ? "active" : ""}
                  >
                    Stock minimun
                  </InputForm>
                </div>
                <div className="col-4">
                  <InputForm
                    integer
                    name="stock_max"
                    val={stock_max}
                    onChange={(e) => onChange(e, setProduit)}
                    obligatory={isOb ? "active" : ""}
                  >
                    Stock maximun
                  </InputForm>
                </div>
              </div>
              <InputForm
                textarea
                rows="3"
                name="description"
                val={description}
                onChange={(e) => onChange(e, setProduit)}
              >
                Description du produit
              </InputForm>
              <InputForm
                textarea
                rows="3"
                name="classification_produit"
                val={classification_produit}
                onChange={(e) => onChange(e, setProduit)}
              >
                Classification du produit
              </InputForm>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger light"
                data-dismiss="modal"
                onClick={closeModal}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setIsOb(true);
                  isAdd.status ? add() : update();
                }}
              >
                {isAdd.status ? "Ajouter" : "Modifier"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
