import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { userConnected } from "../../atoms/authentication";
import { ClassShowMenuState, showNotifNav, showRightNav } from "../../atoms/nav";
import { getData, getRule, getUrl, urlRead } from "../../utils/utils";
import cryptojs from "crypto-js";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Notification from "./Notification";

function HeadNav({socket}) {
  const [userConnect, setUserConnect] = useRecoilState(userConnected);
  const [show, setShow] = useRecoilState(showRightNav);
  const [showNotif, setShowNotif] = useRecoilState(showNotifNav);

  const reloadDataSession = () => {
    // const userJson = cryptojs.AES.decrypt(
    //   localStorage.getItem("gpharma@2.0.0"),
    //   "x85p2qPE2I$7IJ8*EZQQ049bAxhwnr"
    // ).toString(cryptojs.enc.Utf8);
    setUserConnect(JSON.parse(localStorage.getItem("gpharma@2.0.0")));
  };
  useEffect(() => {
    reloadDataSession();
  }, []);
  const logOut = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div id="react-confirm-alert">
            <div className="react-confirm-alert-overlay">
              <div className="react-confirm-alert">
                <div className="react-confirm-alert-body">
                  <h1>Déconnection</h1>
                  <p>Voulez-vous vraiment vous déconnecté de GPharama ?</p>
                  <div>
                    <button
                      className="btn btn-danger mr-2"
                      onClick={() => {
                        getData(
                          "logout",
                          (data) => {
                            document.getElementsByClassName("btn-logout")[0].click();
                            localStorage.removeItem("gpharma@2.0.0");
                          },
                          userConnect.id
                        );
                        onClose();
                      }}
                    >
                      Se déconnecter
                    </button>
                    <button
                      className="btn btn-dark"
                      onClick={() => {
                        onClose();
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      },
    });
  };
  const [ClassShowMenu, setClassShowMenu] = useRecoilState(ClassShowMenuState);
  const handleClick = () => {
    const status = !ClassShowMenu.status;
    setClassShowMenu({ status });
  };
  return (
    <>
      <div className="nav-header">
        <Link type="button" className="brand-logo" to="/">
          <img className="w-100" src="./images/logo.png" alt="Image" />
          {/* <img className="logo-compact" src="./images/logo-text.png" alt = "Image" />
          <img className="brand-title" src="./images/logo-text.png" alt = "Image" /> */}
        </Link>
        <div className="nav-control" onClick={handleClick}>
          <div
            className={
              ClassShowMenu.status ? "hamburger is-active" : "hamburger"
            }
          >
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </div>
        </div>
      </div>

      <a href="/connexion" className="d-none btn-logout" id=""></a>
      <div className="header">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left"></div>
              <ul className="navbar-nav header-right">
                <Notification  socket={socket} />
                <li className="nav-item dropdown header-profile">
                  <a
                    className="nav-link"
                    type="button"
                    role="button"
                    data-toggle="dropdown"
                  >
                    <div className="header-info">
                      <span className="text-black">
                        Bonjour,
                        <strong>&nbsp;{userConnect.nom_utilisateur}</strong>
                      </span>
                      <p className="fs-12 mb-0">
                        {getRule(userConnect.type_utilisateur)}
                      </p>
                    </div>
                    <img
                      src={
                        userConnect.image
                          ? getUrl("images/utilisateur", userConnect.image)
                          : "images/users/1.jpg"
                      }
                      width={20}
                      alt="Image"
                    />
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <button
                      type="button"
                      className="dropdown-item ai-icon"
                      onClick={() => {
                        setShowNotif("0");
                        setShow(!show);
                      }}
                    >
                      <svg
                        id="icon-user1"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary"
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx={12} cy={7} r={4} />
                      </svg>
                      <span className="ml-2">Profile </span>
                    </button>

                    <button
                      type="button"
                      className="dropdown-item ai-icon"
                      onClick={logOut}
                    >
                      <svg
                        id="icon-logout"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-danger"
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1={21} y1={12} x2={9} y2={12} />
                      </svg>
                      <span className="ml-2">
                        <a type="button">Déconnection</a>
                      </span>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default HeadNav;
