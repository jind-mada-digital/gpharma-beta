import cryptojs from "crypto-js";
import React, { useEffect, useState } from "react";
import NavElement, { NavElementChildren } from "./NavElement";
import HeadNav from "./HeadNav";
import LeftNav from "./LeftNav";
import FooterNav from "./FooterNav";
import RightNav from "./RightNav";
import { useRecoilState } from "recoil";
import { userConnected } from "../../atoms/authentication";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import socketIO from "socket.io-client"
 
const socket = socketIO.connect("https://node.gpharma.mada-digital.net")
// const socket = socketIO.connect("http://localhost:5000")

function Nav() {
  const [userConnect, setUserConnect] = useRecoilState(userConnected);
  const [ListMenu, setListMenu] = useState([
    {
      title: "Accueil",
      link: "/",
      icon: "fa fa-television fa-lg",
      auth: ["ADMIN", "GUICHETIER", "CAISSIER"],
    },
    {
      title: "Vente",
      icon: "fa fa-shopping-cart fa-lg",
      auth: ["ADMIN", "GUICHETIER", "CAISSIER"],
      child: [
        {
          title: "Caisse",
          link: "/caisse",
          icon: "fa fa-money-bill-alt",
          auth: ["ADMIN", "CAISSIER"],
        },
        {
          title: "Guichet",
          link: "/guichet",
          icon: "fa fa-list-alt fa-lg",
          auth: ["ADMIN", "GUICHETIER"],
        },
      ],
    },
    {
      title: "Administration",
      icon: "fa fa-cogs fa-lg",
      auth: ["ADMIN"],
      child: [
        {
          title: "Ajustement",
          link: "/ajustement",
          icon: "fa fa-balance-scale",
          auth: ["ADMIN"],
        },
        {
          title: "Fournisseur",
          link: "/fournisseur",
          icon: "fa fa-industry",
          auth: ["ADMIN"],
        },
        {
          title: "Ravitaillement",
          link: "/ravitaillement",
          icon: "fa fa-shipping-fast",
          auth: ["ADMIN"],
        },
        {
          title: "Produit",
          link: "/produit",
          icon: "fa fa-dolly-flatbed",
          auth: ["ADMIN"],
        },
        {
          title: "Paramètre",
          link: "/parametre",
          icon: "fa fa-cog",
          auth: ["ADMIN"],
        },
        {
          title: "Marge bénéficiaire",
          link: "/marge_beneficiaire",
          icon: "fa fa-line-chart",
          auth: ["ADMIN"],
        },
        {
          title: "Société",
          link: "/societe",
          icon: "fa fa-hospital-alt",
          auth: ["ADMIN"],
        },
      ],
    },
    {
      title: "Utilisateur",
      link: "/utilisateur",
      icon: "fa fa-user-cog",
      auth: ["ADMIN"],
    },
    {
      title: "Pharmacie",
      link: "/pharmacie",
      icon: "fa fa-cog",
      auth: ["ADMIN"],
    },
  ]);
  const [classeMenuActive, setClasseMenuActive] = useState("");
  useEffect(() => {
    // const userJson = cryptojs.AES.decrypt(
    //   localStorage.getItem("gpharma@2.0.0"),
    //   "x85p2qPE2I$7IJ8*EZQQ049bAxhwnr"
    // ).toString(cryptojs.enc.Utf8);
    setUserConnect(JSON.parse(localStorage.getItem("gpharma@2.0.0")));
  }, []);
  useMemo(()=>{
    return classeMenuActive
  }, [classeMenuActive])
  return (
    <>
      <HeadNav socket={socket}/>
      <RightNav socket={socket}/>
      <LeftNav>
        {ListMenu.map((item, index) => {
          // console.log("item: " , item.auth.includes(userConnect.type_utilisateur)); item.auth.includes(userConnect.type_utilisateur?userConnect.type_utilisateur:"")
          //element.auth.includes(userConnect.type_utilisateur)
          const a = item.auth.includes(userConnect.type_utilisateur) ? (
            item.child ? (
              <li
                key={item.title + index}
                className={item.title == classeMenuActive ? "mm-active" : ""}
                onClick={() => {
                  if (!classeMenuActive) setClasseMenuActive(item.title);
                  if (classeMenuActive) setClasseMenuActive("");
                }}
              >
                <a
                  className="has-arrow ai-icon"
                  type="button"
                  aria-expanded={
                    item.title == classeMenuActive ? "true" : "false"
                  }
                >
                  <i className={item.icon} />
                  <span className="nav-text">
                    <b>{item.title}</b>
                  </span>
                </a>
                <ul
                  aria-expanded="false"
                  className={
                    item.title == classeMenuActive
                      ? "mm-collapse mm-show"
                      : "mm-collapse"
                  }
                >
                  {item.child.map((element, index) => {
                    const b = element.auth.includes(userConnect.type_utilisateur) ? (
                      <li key={element.title + index}>
                        <Link to={element.link} >
                          <i className={element.icon} />
                          <span  >
                            <strong> {element.title} </strong>
                          </span>
                        </Link>
                      </li>
                    ) : null;
                    return b;
                  })}
                </ul>
              </li>
            ) : (
              <li
                key={item.title + index}
                className={item.title == classeMenuActive ? "mm-active" : ""}
                onClick={() => {
                  if (!classeMenuActive) setClasseMenuActive(item.title);
                  if (classeMenuActive) setClasseMenuActive("");
                }}
              >
                <Link to={item.link} className="ai-icon">
                  <i className={item.icon} />
                  <span className="nav-text ">
                    <strong> {item.title} </strong>
                  </span>
                </Link>
              </li>
            )
          ) : null;
          return a;
        })}
      </LeftNav>
      <FooterNav />
    </>
  );
}

export default Nav;
