import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import Accueil from "../pages/accueil";
import Utilisateur from "../pages/utilisateur";
import NotFound from "../pages/notFound";
import Fournisseur from "../pages/fournisseur";
import Ravitaillement from "../pages/ravitaillement";
import Parametre from "../pages/parametre";
import Middleware from "../middlewares";
import Produit from "../pages/produit";
import Ajustement from "../pages/ajustement";
import Societe from "../pages/societe";
import Caisse from "../pages/caisse";
import Guichet from "../pages/guichet";
import Pharmacie from "../pages/pharmacie";
import { useRecoilState } from "recoil";
import { userConnected } from "../../atoms/authentication";
import cryptojs from "crypto-js";
import Marge_beneficiaire from "../pages/marge_beneficiaire";
import PrivateRoute from "./PrivateRoute";

function MyRoute() {
  const [userConnect, setUserConnect] = useRecoilState(userConnected);
  const getLogin = () => {
    if (localStorage.getItem("gpharma@2.0.0")) {
      return <Navigate to="/" />;
    }
    return <Login />;
  };
  React.useEffect(() => {
    if (localStorage.getItem("gpharma@2.0.0")) {
      // const userJson = cryptojs.AES.decrypt(
      //   localStorage.getItem("gpharma@2.0.0"),
      // "x85p2qPE2I$7IJ8*EZQQ049bAxhwnr"
      // ).toString(cryptojs.enc.Utf8);
      setUserConnect(JSON.parse(localStorage.getItem("gpharma@2.0.0")));
    }
  }, []); 
  return (
    <>
      <Routes>
        <Route exact path="/connexion" element={getLogin()} />
        <Route exact path="/" element={<PrivateRoute />}>
            <Route exact path="/" element={<Accueil/>} />
          </Route> 
        {userConnect.type_utilisateur == "CAISSIER" ||
        userConnect.type_utilisateur == "ADMIN" ? (
          <Route exact path="/" element={<PrivateRoute />}>
            <Route exact path="/caisse" element={<Caisse />} />
          </Route>
        ) : null}

        {userConnect.type_utilisateur == "GUICHETIER" ||
        userConnect.type_utilisateur == "ADMIN" ? (
          <Route exact path="/guichet" element={<PrivateRoute />}>
            <Route exact path="/guichet" element={<Guichet/>} />
          </Route> 
        ) : null}
        {userConnect.type_utilisateur == "ADMIN" ? (
          <>
          <Route exact path="/ajustement" element={<PrivateRoute />}>
            <Route exact path="/ajustement" element={<Ajustement/>} />
          </Route> 
          <Route exact path="/fournisseur" element={<PrivateRoute />}>
            <Route exact path="/fournisseur" element={<Fournisseur/>} />
          </Route> 
          <Route exact path="/ravitaillement" element={<PrivateRoute />}>
            <Route exact path="/ravitaillement" element={<Ravitaillement/>} />
          </Route> 
          <Route exact path="/produit" element={<PrivateRoute />}>
            <Route exact path="/produit" element={<Produit/>} />
          </Route> 
          <Route exact path="/parametre" element={<PrivateRoute />}>
            <Route exact path="/parametre" element={<Parametre/>} />
          </Route> 
          <Route exact path="/marge_beneficiaire" element={<PrivateRoute />}>
            <Route exact path="/marge_beneficiaire" element={<Marge_beneficiaire/>} />
          </Route> 
          <Route exact path="/marge_beneficiaire" element={<PrivateRoute />}>
            <Route exact path="/marge_beneficiaire" element={<Marge_beneficiaire/>} />
          </Route> 
          <Route exact path="/societe" element={<PrivateRoute />}>
            <Route exact path="/societe" element={<Societe/>} />
          </Route> 
          <Route exact path="/marge_beneficiaire" element={<PrivateRoute />}>
            <Route exact path="/marge_beneficiaire" element={<Marge_beneficiaire/>} />
          </Route> 
          <Route exact path="/utilisateur" element={<PrivateRoute />}>
            <Route exact path="/utilisateur" element={<Utilisateur/>} />
          </Route> 
          <Route exact path="/pharmacie" element={<PrivateRoute />}>
            <Route exact path="/pharmacie" element={<Pharmacie/>} />
          </Route>  
          </>
        ) : null}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default MyRoute;
