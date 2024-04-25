import React, { useState } from "react";
import cryptojs from "crypto-js";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userConnected } from "../../atoms/authentication";
import { useEffect } from "react";

function NavElement({ to, icon, title, children }) {
  const [userConnect, setUserConnect] = useRecoilState(userConnected);
  const [page, setPage] = useState([]);
  const getPage = (userJson) => {
    setPage([])
    if (userJson.type_utilisateur == "CAISSIER")
      setPage([ ...page,"accueil", "caisse"]);
    else if (userJson.type_utilisateur == "GUICHETIER")
      setPage([ ...page,"accueil", "guichet"]);
    else if (userJson.type_utilisateur == "ADMIN")
      setPage([ ...page,
        "accueil",
        "caisse",
        "guichet",
        "utilisateur",
        "ajustement",
        "fournisseur",
        "ravitaillement",
        "produit",
        "societe",
        "parametre",
      ]);
      // console.log("userJson", userJson.type_utilisateur , page);
  };
  useEffect(() => {
    //  console.log(page.includes(to), page, to)
    // const userJson = cryptojs.AES.decrypt(
    //   localStorage.getItem("gpharma@2.0.0"),
    //   "x85p2qPE2I$7IJ8*EZQQ049bAxhwnr"
    // ).toString(cryptojs.enc.Utf8);
    setUserConnect(JSON.parse(localStorage.getItem("gpharma@2.0.0")));
  }, []);
  useEffect(() => { 
    if(userConnect.type_utilisateur){
      getPage(userConnect)
    }
  }, [userConnect]);
  return (
    <>
      { true ? (
        <li className="fs-12">
          {!children ? (
            <Link
              to={to}
              className={children ? "has-arrow ai-icon" : "ai-icon"}
              aria-expanded="false"
            >
              <i className={icon} />
              <span className="nav-text ">
                <strong> {title}</strong>
              </span>
            </Link>
          ) : (
            <a
              type="button"
              className={children ? "has-arrow ai-icon" : "ai-icon"}
              aria-expanded="false"
            >
              <i className={icon} />
              <span className="nav-text ">
                <strong> {title}</strong>
              </span>
            </a>
          )}
          {children ? <ul aria-expanded="false">{children}</ul> : ""}
        </li>
      ) : null}
    </>
  );
}

export function NavElementChildren({ to, icon, title }) {
  
  return (
    <li className="fs-12">
      <Link to={to} id={"idLink" + title}>
        <i className={icon} />
        {title}
      </Link>
    </li>
  );
}

export default NavElement;
