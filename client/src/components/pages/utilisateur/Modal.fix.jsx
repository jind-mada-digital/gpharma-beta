import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import Select from "react-select";
import {
  isAddState,
  listUtilisateurState,
  userSelectState,
  previewImage,
} from "../../../atoms/utilisateur.js";
import {
  getData,
  addData,
  updateData,
  InputForm,
  SelectForm,
  sexeOptions,
  filterOption,
  onChange,
  getSpan,
} from "../../../utils/utils.js";
 
//FIN Déclaration des variables
function Modal() {
    const optionType = [
        {
          value: "ADMIN",
          label: "Administrateur",
        },
        {
          value: "CAISSIER",
          label: "Caissier",
        },
        {
          value: "GUICHETIER",
          label: "Guichetier",
        },
      ];
    const initialize = {
        nom_utilisateur: "",
        nom_login: "",
        sexe: {
          value: "test",
          label: "test",
        },
        type_utilisateur: {
          value: "test",
          label: "test",
        },
        contact: "",
        email: "",
        mot_de_passe: "",
        image: null,
      }; 
      //DEBUT Déclaration des states ET ref
  const [utilisateur, setUtilisateur] = useState(initialize);
  const {
    nom_utilisateur,
    nom_login,
    sexe,
    type_utilisateur,
    contact,
    email,
    mot_de_passe,
    image,
  } = utilisateur;
  const [isObligatory, setIsObligatory] = useState(false);
  const [optionsType, setOptionsType] = useState(optionType);
  const [preview, setPreview] = useRecoilState(previewImage);
  const [isAdd, setIsAdd] = useRecoilState(isAddState);
  const [listUser, setListUser] = useRecoilState(listUtilisateurState);
  const [userSelect, setUserSelect] = useRecoilState(userSelectState);

  //DEBUT Déclaration des functions Modal
  const getAllUser = () => { 
    setPreview("images/profile/1.jpg");
    getData(`utilisateurs`, setListUser);
  };

  const addUser = () => {
    if (
      !nom_utilisateur ||
      !nom_login ||
      !type_utilisateur ||
      !sexe ||
      !nom_login ||
      !mot_de_passe ||
      !contact
    )
      return;
    let formData = new FormData();
    console.log("file", image);
    formData.append("file", image);
    formData.append(
      "data",
      JSON.stringify({
        nom_utilisateur,
        nom_login,
        type_utilisateur: type_utilisateur.value,
        sexe: sexe.value,
        nom_login,
        mot_de_passe,
        contact,
        email,
      })
    );
    addData("utilisateur", formData, getAllUser, true);
  };
  const updateUser = () => {
    if (
      !nom_utilisateur ||
      !nom_login ||
      !type_utilisateur ||
      !sexe ||
      !nom_login ||
      !contact
    )
      return;
    let json = {
      nom_utilisateur,
      nom_login,
      type_utilisateur: type_utilisateur.value,
      sexe: sexe.value,
      nom_login,
      contact,
      email,
    };
    if (mot_de_passe) json["mot_de_passe"] = mot_de_passe;
    let formData = new FormData();
    console.log("file", image);
    formData.append("file", image);
    formData.append("data", JSON.stringify(json));
    updateData("utilisateur", userSelect.id, formData, getAllUser, true);
  };
   
  //FIN Déclaration des simples functions
  //FIN Déclaration des functions Modal
  useEffect(() => {
    setUtilisateur(initialize);
    setIsObligatory(false);
    getAllUser();
    console.log(filterOption(optionsType, type_utilisateur));
  }, []);
  //DEBUT utilisation states
  useEffect(() => {
    setUtilisateur({
      ...userSelect,
      ["type_utilisateur"]: optionsType.filter(
        (option) => option.value === userSelect.type_utilisateur
      )[0],
      ["sexe"]: sexeOptions.filter(
        (option) => option.value === userSelect.sexe
      )[0],
    });
    setPreview(userSelect.url ? userSelect.url : "images/profile/1.jpg");
  }, [userSelect]);
  //FIN utilisation states

  return (
    <div
      className="modal fade"
      id="modalUtilisateur"
      style={{ display: "none" }}
      aria-modal="true"
      data-backdrop="static"
      data-keyboard="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"> un utilsateur
            </h5>
            <button 
              type="button"
              className="close"
              data-dismiss="modal"
              onClick={() => { 
              }}
            >
              <span>×</span>
            </button>
          </div>
          <div className="modal-body"> 
            
            <div className="row">
              <div className="col-6">
                <InputForm
                  name="nom_login"
                  val={nom_login}
                  onChange={(e) => onChange(e, setUtilisateur)}
                  obligatory={isObligatory ? "active" : "desactive"}
                >
                  Identifiant
                </InputForm>
              </div>
              <div className="col-6">
                <SelectForm
                  val={type_utilisateur}
                  value={filterOption(optionsType, type_utilisateur)}
                  onChange={(e) =>
                    onChange(e, setUtilisateur, "type_utilisateur")
                  }
                  options={optionsType}
                  obligatory={isObligatory ? "active" : "desactive"}
                >
                  Type utilisateur
                </SelectForm> 
            <Select value={filterOption(optionsType, type_utilisateur)} options={optionType}/>
            
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger light"
              data-dismiss="modal" 
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn btn-primary" 
            >
              {true ? "Ajouter" : "Modifier"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
