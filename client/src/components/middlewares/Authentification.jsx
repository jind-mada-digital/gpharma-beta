import React from "react";
import { Navigate  } from "react-router-dom"; 

const authentification = (Page) => {  
  if (!localStorage.getItem("gpharma@2.0.0")) {
    return  <Navigate to="/connexion"/>  ;
  } 
  return <Page />;
};
export default authentification;
