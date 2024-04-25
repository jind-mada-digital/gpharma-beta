import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  addData,
  getData,
  getUrl,
  InputForm,
  updateData,
  onChange,
} from "../../../utils/utils";
import {
  isAddState,
  listFournisseur,
  fournisseurSelect,
  initialize,
} from "../../../atoms/fournisseur";

function Modal() {
  const [isAdd, setIsAdd] = useRecoilState(isAddState);
  const [list, setList] = useRecoilState(listFournisseur);
  const [fournisseurSelected, setFournisseurSelected] =
    useRecoilState(fournisseurSelect);
  const [fournisseur, setFournisseur] = useState(initialize);
  const [isOb, setIsOb] = React.useState(false);
  const [preview, setPreview] = React.useState("");
  const closeRef = React.useRef();
  const inputRef = React.useRef();
  const {
    nom_fournisseur,
    contact_fournisseur,
    contact_secretaire,
    compte_PCG,
    logo,
    condition_paiement,
    delais_reglement,
    email,
    adresse,
    nif,
    stat,
    sigle,
  } = fournisseur;

  const getAll = () => {
    setIsOb(false);
    setPreview("");
    setFournisseur(initialize);
    closeRef.current.click();
    getData("fournisseur", setList);
  };
  const handleClickInput = () => {
    setIsOb(false);
    inputRef.current.click();
  };
  const add = () => {
    if (
      !nom_fournisseur ||
      !contact_fournisseur ||
      !contact_secretaire ||
      !compte_PCG ||
      !condition_paiement ||
      !delais_reglement ||
      !email ||
      !adresse ||
      !nif ||
      !stat ||
      !sigle
    ) {
      return;
    }
    let formData = new FormData();
    formData.append("file", logo);
    formData.append(
      "data",
      JSON.stringify({
        nom_fournisseur,
        contact_fournisseur,
        contact_secretaire,
        compte_PCG,
        logo,
        condition_paiement,
        delais_reglement,
        email,
        adresse,
        nif,
        stat,
        sigle,
      })
    );
    addData("fournisseur", formData, getAll, true);
  };
  const update = () => {
    if (
      !nom_fournisseur ||
      !contact_fournisseur ||
      !contact_secretaire ||
      !compte_PCG ||
      !condition_paiement ||
      !delais_reglement ||
      !email ||
      !adresse ||
      !nif ||
      !stat ||
      !sigle
    ) {
      return;
    }
    let formData = new FormData();
    formData.append("file", logo);
    formData.append(
      "data",
      JSON.stringify({
        nom_fournisseur,
        contact_fournisseur,
        contact_secretaire,
        compte_PCG,
        logo,
        condition_paiement,
        delais_reglement,
        email,
        adresse,
        nif,
        stat,
        sigle,
      })
    );
    updateData("fournisseur", fournisseurSelected.id, formData, getAll, true);
  };
  useEffect(() => {
    setFournisseur(fournisseurSelected);
    if (fournisseurSelected.logo)
      setPreview(getUrl("images/fournisseur", fournisseurSelected.logo));
    else setPreview("");
  }, [fournisseurSelected]);
  useEffect(() => {
    if (isAdd.status) {
      setPreview("");
      setFournisseur(initialize);
    }
  }, [isAdd]);
  return (
    <div
      className="modal fade"
      id="modalFournisseur"
      style={{ display: "none" }}
      aria-modal="true"
      data-backdrop="static"
      data-keyboard="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isAdd.status ? "Ajouter" : "Modifier"} un fournisseur
            </h5>
            <button
              ref={closeRef}
              type="button"
              className="close"
              data-dismiss="modal"
              onClick={() => {
                setIsOb(false);
              }}
            >
              <span>×</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="row text-center">
              <img
                style={{ width: "auto", height: "15vh", borderRadius: "2%" }}
                src={preview ? preview : "images/profile/1.jpg"}
                alt="Image"
                className="rounded mx-auto d-block shadow-sm"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Cliqué ici pour changer l'image"
                onClick={handleClickInput}
              />
              <input
                name="logo"
                type="file"
                accept=".jpg,.png,.jpeg"
                className="d-none"
                ref={inputRef}
                onChange={(e) => {
                  if (e.target.files[0]) {
                    onChange(e, setFournisseur);
                    setPreview(URL.createObjectURL(e.target.files[0]))
                  }
                }}
              />
            </div>
            <InputForm
              name="nom_fournisseur"
              val={nom_fournisseur}
              onChange={(e) => onChange(e, setFournisseur)}
              obligatory={isOb ? "active" : ""}
            >
              Nom fournisseur
            </InputForm>
            <div className="row">
              <div className="col-6">
                <InputForm
                  name="contact_fournisseur"
                  val={contact_fournisseur}
                  onChange={(e) => onChange(e, setFournisseur)}
                  obligatory={isOb ? "active" : ""}
                >
                  Contact fournisseur
                </InputForm>
              </div>
              <div className="col-6">
                <InputForm
                  name="contact_secretaire"
                  val={contact_secretaire}
                  onChange={(e) => onChange(e, setFournisseur)}
                  obligatory={isOb ? "active" : ""}
                >
                  Contact secretaire
                </InputForm>
              </div>
            </div>
            <InputForm
              name="compte_PCG"
              val={compte_PCG}
              onChange={(e) => onChange(e, setFournisseur)}
              obligatory={isOb ? "active" : ""}
            >
              Compte Plan Comptable Général
            </InputForm>
            <div className="row">
              <div className="col-6">
                <InputForm
                  number
                  min="0"
                  name="delais_reglement"
                  val={delais_reglement}
                  onChange={(e) => onChange(e, setFournisseur)}
                  postIcon={{ text: "En jours" }}
                  obligatory={isOb ? "active" : ""}
                >
                  Delais règlement
                </InputForm>
              </div>
              <div className="col-6">
                <InputForm
                  name="sigle"
                  val={sigle}
                  onChange={(e) => onChange(e, setFournisseur)}
                  obligatory={isOb ? "active" : ""}
                  maxLength="5"
                >
                  Sigle
                </InputForm>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <InputForm
                  email
                  name="email"
                  val={email}
                  onChange={(e) => onChange(e, setFournisseur)}
                  obligatory={isOb ? "active" : ""}
                >
                  Email
                </InputForm>
              </div>
              <div className="col-6">
                <InputForm
                  name="adresse"
                  val={adresse}
                  onChange={(e) => onChange(e, setFournisseur)}
                  obligatory={isOb ? "active" : ""}
                >
                  Adresse
                </InputForm>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <InputForm
                  name="nif"
                  val={nif}
                  onChange={(e) => onChange(e, setFournisseur)}
                  obligatory={isOb ? "active" : ""}
                >
                  Nif
                </InputForm>
              </div>
              <div className="col-6">
                <InputForm
                  name="stat"
                  val={stat}
                  onChange={(e) => onChange(e, setFournisseur)}
                  obligatory={isOb ? "active" : ""}
                >
                  Stat
                </InputForm>
              </div>
            </div>
            <InputForm
              textarea
              rows="3"
              name="condition_paiement"
              val={condition_paiement}
              onChange={(e) => onChange(e, setFournisseur)}
              obligatory={isOb ? "active" : ""}
            >
              Condition de paiement
            </InputForm>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger light"
              data-dismiss="modal"
              onClick={() => {
                setIsOb(false);
                setPreview("");
                setFournisseur(initialize);
              }}
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
  );
}

export default Modal;
