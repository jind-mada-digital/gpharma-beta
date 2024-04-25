import React, { useEffect, useState } from "react";
import cryptojs from "crypto-js";
import { useRecoilState } from "recoil";
import { showNotifNav, showRightNav } from "../../atoms/nav";
import {
  getRule,
  getUrl,
  InputForm,
  updateData,
  urlRead,
  urlUpdate,
} from "../../utils/utils";
import { userConnected } from "../../atoms/authentication";
import "./RightNav.css";
import { toast } from "react-toastify";
import cryptoJs from "crypto-js";
import axios from "axios";
import GestionNotification from "./GestionNotification";

function RightNav({ socket }) {
  const [userConnect, setUserConnect] = useRecoilState(userConnected);
  const [show, setShow] = useRecoilState(showRightNav);
  const [showNotif, setShowNotif] = useRecoilState(showNotifNav);
  const [last_mot_de_passe, setLast_mot_de_passe] = useState("");
  const [mot_de_passe, setMot_de_passe] = useState("");
  const [confirme_mot_de_passe, setConfirme_Mot_de_passe] = useState("");
  const [isOb, setIsOb] = useState(false);
  const [nom_login, setNom_login] = useState(userConnect.nom_login);
  const [nom_utilisateur, setNom_utilisateur] = useState(
    userConnect.nom_utilisateur
  );
  const inputRef = React.useRef();
  const [preview, setPreview] = useState("");
  const [imageProfile, setImageProfile] = useState(null);
  const loadImage = (event) => {
    const img = event.target.files[0];
    setPreview(URL.createObjectURL(img));
  };
  const handleClickInput = () => {
    inputRef.current.click();
  };
  const changePwd = () => {
    if (!mot_de_passe || !confirme_mot_de_passe) {
      setIsOb(true);
      return;
    }
    if (mot_de_passe !== confirme_mot_de_passe) {
      toast.warning("Le mot de passe de confirmation n'est pas indentique!");
      return;
    }
    if (mot_de_passe === last_mot_de_passe) {
      toast.warning("Le nouveau mot de passe est indentique à l'ancien!");
      return;
    }
    let formData = new FormData();
    formData.append("data", JSON.stringify({ last_mot_de_passe, mot_de_passe }));
    const put = () => axios.put(urlUpdate("changePwd", userConnect.id), formData).then((response) => {
      reloadDataUser(setUserConnect);
      document.getElementById("close").click();
    })
    .catch((error) => {
      toast.warning(JSON.parse(error.response.request.response).message);
    });
    toast.promise(put, {
      pending: `Modification en cours ...`, 
    });
  };

  const changeName = () => {
    if (!nom_login || !nom_utilisateur) {
      setIsOb(true);
      return;
    }
    let formData = new FormData();
    formData.append("data", JSON.stringify({ nom_login, nom_utilisateur }));
    const put = () => axios.put(urlUpdate("utilisateur", userConnect.id), formData).then((response) => {
      reloadDataUser(setUserConnect);
      document.getElementById("close").click();
    });
    toast.promise(put, {
      pending: `Modification en cours ...`,
      error: `Une erreur est survenue lors du tentative de modification!`,
    });
  };

  const reloadDataUser = (setUserConnect) => {
    axios
      .get(urlRead("reloadDataUser", userConnect.id))
      .then((response) => {
        localStorage.setItem("gpharma@2.0.0", response.data.dataUser);
        // const userJson = cryptojs.AES.decrypt(
        //   localStorage.getItem("gpharma@2.0.0"),
        //   "x85p2qPE2I$7IJ8*EZQQ049bAxhwnr"
        // ).toString(cryptojs.enc.Utf8);
        setUserConnect(JSON.parse(localStorage.getItem("gpharma@2.0.0")));
      })
      .catch(() => {
        toast.warning(
          "Une erreur est survenue lors du mise à jours des données!"
        );
      });
  };

  const changeImage = () => {
    let formData = new FormData();
    formData.append("file", imageProfile);
    console.log("formData", formData);
    updateData(
      "utilisateur",
      userConnect.id,
      formData,
      () => {
        reloadDataUser(setUserConnect);
        setPreview("");
      },
      true
    );
  };
  return (
    <>
      <div className={show ? "chatbox active " : "chatbox"}>
        <div className="chatbox-close" onClick={() => setShow(false)} />
        {/* <div className="custom-tab-1">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              
            </li>
          </ul>
        </div> */}
        <div className="bg-primary pt-3 pb-0">
          <div className="d-flex justify-content-between mx-5">
            <p
              style={{ fontSize: "16px", cursor: "pointer" }}
              className={
                showNotif == "0"
                  ? "text-white text-center    font-w900"
                  : "text-white text-center   text-dark text-light"
              }
              onClick={() => {
                setShowNotif("0");
              }}
            >
              PROFILE
            </p>
            <p
              style={{ fontSize: "16px", cursor: "pointer" }}
              className={
                showNotif == "1"
                  ? "text-white text-center font-w900"
                  : "text-white text-center  text-dark text-light"
              }
              onClick={() => {
                setShowNotif("1");
              }}
            >
              NOTIFICATIONS
            </p>
          </div>
        </div>
        <div
          className="yass-scroll"
          style={{ overflowY: "scroll", height: "90vh" }}
        >
          {showNotif == "0" ? (
            <>
              <div className="custom-tab-1 bg-light">
                <div className="card-body">
                  <div className="">
                    <div className="profile-blog mb-3">
                      {/* <h5 className="text-primary d-inline">Information</h5> */}
                      <img
                        src={
                          preview
                            ? preview
                            : userConnect.image
                              ? getUrl("images/utilisateur", userConnect.image)
                              : "images/profile/1.jpg"
                        }
                        width={"40vh"}
                        alt="Image"
                        accept=".jpg,.png,.jpeg"
                        className="img-fluid mt-2 mb-4 w-100"
                        onClick={handleClickInput}
                      />

                      <input
                        name="image"
                        type="file"
                        accept=".jpg,.png,.jpeg"
                        className="d-none"
                        ref={inputRef}
                        onChange={(e) => {
                          setImageProfile(e.target.files[0]);
                          setPreview(URL.createObjectURL(e.target.files[0]));
                        }}
                      />
                      <button
                        className={
                          preview ? "btn btn-warning btn-sm light" : "d-none"
                        }
                        onClick={changeImage}
                      >
                        Valider le changement
                      </button>
                    </div>
                    <div className="profile-statistics mb-3">
                      <div className="text-center">
                        <div className="row">
                          <div className="col">
                            <h3 className="m-b-0">{`${userConnect.nom_utilisateur} (${userConnect.nom_login})`}</h3>
                            <span>{getRule(userConnect.type_utilisateur)}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <a
                            type="button"
                            className="btn btn-primary btn-sm mb-1 mr-1"
                            data-toggle="modal"
                            data-target="#profilModal"
                            onClick={() => {
                              setNom_login(userConnect.nom_login);
                              setNom_utilisateur(userConnect.nom_utilisateur);
                            }}
                          >
                            <i className="fa fa-edit"></i>
                          </a>
                          <a
                            type="button"
                            className="btn btn-primary btn-sm mb-1"
                            data-toggle="modal"
                            data-target="#profilModalPwd"
                          >
                            Changer le mot de passe
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="m-4 mt-3" style={{ minHeight: "26vh" }}>
                <h4>
                  <a href="post-details.html" className="text-black">
                    {
                      JSON.parse(localStorage.getItem('gpharma@2.0.0')).type_utilisateur == "ADMIN" ? "Administrateur de GPharma" : JSON.parse(localStorage.getItem('gpharma@2.0.0')).type_utilisateur == "CAISSIER" ? "" : ""}
                  </a>
                </h4>
                <p className="mt-2 ">
                  {
                    JSON.parse(localStorage.getItem('gpharma@2.0.0')).type_utilisateur == "ADMIN" ? `
                Ce privilège vous octroie le contrôle totale sur la gestion de votre pharmacie dans GPharma version 2.0.0 . Vous pouvez voir le manuel pour en savoir un plus sur ce qui est la manipulation du logiciel.` : JSON.parse(localStorage.getItem('gpharma@2.0.0')).type_utilisateur == "CAISSIER" ? "" : ""}
                </p>
              </div>
              <div
                className="bg-light pt-2 w-100 "
                style={{ top: "0vh !important", position: 'absolute' }}
              >
                <p className="text-center">
                  Copyright © Développé par{" "}
                  <a
                    href="https://www.mada-digital.net/"
                    className="text-primary"
                    target="_blank"
                  >
                    MADA-Digital
                  </a>
                </p>
              </div>
            </>
          ) : (
            <>
              <GestionNotification socket={socket} />
              <div
                className="bg-light pt-2 w-100 "
                style={{ marginTop: "5vh", position: 'absolute' }}
              >
                <p className="text-center">
                  Copyright © Développé par{" "}
                  <a
                    href="https://www.mada-digital.net/"
                    className="text-primary"
                    target="_blank"
                  >
                    MADA-Digital
                  </a>
                </p>
              </div>
            </>
          )}

        </div>
      </div>

      <div
        className="modal fade"
        id="profilModal"
        data-backdrop="static"
        data-keyboard="true"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modification des imforimations</h5>
              <button
                type="button"
                className="close"
                id="close"
                data-dismiss="modal"
                onClick={() => {
                  setNom_login(userConnect.nom_login);
                  setNom_utilisateur(userConnect.nom_utilisateur);
                  setIsOb(false);
                }}
              >
                <span>×</span>
              </button>
            </div>
            <div className="modal-body">
              <InputForm
                val={nom_login}
                onChange={(e) => setNom_login(e.target.value)}
                obligatory={isOb ? "active" : ""}
              >
                Identifiant
              </InputForm>
              <InputForm
                val={nom_utilisateur}
                onChange={(e) => setNom_utilisateur(e.target.value)}
                obligatory={isOb ? "active" : ""}
              >
                Nom d'utilisateur
              </InputForm>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger light"
                data-dismiss="modal"
                onClick={() => {
                  setNom_login(userConnect.nom_login);
                  setNom_utilisateur(userConnect.nom_utilisateur);
                  setIsOb(false);
                }}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  changeName();
                }}
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="profilModalPwd"
        data-backdrop="static"
        data-keyboard="true"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modification le mot de passe</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => {
                  setMot_de_passe("");
                  setLast_mot_de_passe("");
                  setIsOb(false);
                  setConfirme_Mot_de_passe("");
                }}
              >
                <span>×</span>
              </button>
            </div>
            <div className="modal-body">
              <InputForm
                password
                val={last_mot_de_passe}
                onChange={(e) => setLast_mot_de_passe(e.target.value)}
                obligatory={isOb ? "active" : ""}
              >
                Ancien mot de passe
              </InputForm>
              <InputForm
                password
                val={mot_de_passe}
                onChange={(e) => setMot_de_passe(e.target.value)}
                obligatory={isOb ? "active" : ""}
              >
                Nouveau mot de passe
              </InputForm>
              <InputForm
                password
                val={confirme_mot_de_passe}
                onChange={(e) => setConfirme_Mot_de_passe(e.target.value)}
                obligatory={isOb ? "active" : ""}
              >
                Confirmer le mot de passe
              </InputForm>
            </div>
            <div className="modal-footer">
              <button
                id="closePwd"
                type="button"
                className="btn btn-danger light"
                data-dismiss="modal"
                onClick={() => {
                  setMot_de_passe("");
                  setLast_mot_de_passe("");
                  setIsOb(false);
                  setConfirme_Mot_de_passe("");
                }}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  changePwd();
                }}
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RightNav;
