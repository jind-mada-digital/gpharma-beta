import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <div className="authincation h-100" style={{ marginTop: "25vh" }}>
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-5">
              <div className="form-input-content text-center error-page">
                <h1 className="error-text font-weight-bold">404</h1>
                <h4>
                  <i className="fa fa-exclamation-triangle text-warning"></i> La
                  page que vous cherchiez est introuvable !
                </h4>
                <p>
                  Vous avez peut-être mal tapé l'adresse ou la page a peut-être
                  été déplacée.
                </p>
                <div>
                  {false ? (
                    <Link to="/">
                      <button className="btn btn-primary" type="button">
                        Retourner à l'accueil
                      </button>
                    </Link>
                  ) : (
                    <Link to="/connexion">
                      <button className="btn btn-primary" type="button">
                        Se connecter
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound;
