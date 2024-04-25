import React, { useState } from "react";

function Viewer({ data }) {
  return (
    <>
      <div
        className="modal fade"
        id="viewUtilisateur"
        style={{ display: "none" }}
        aria-modal="true"
        data-backdrop="static"
        data-keyboard="true" 
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{data.nom_utilisateur}</h5>
              <button type="button" className="close" data-dismiss="modal">
                <span>×</span>
              </button>
            </div>
            <div className="modal-body ">
              <div className="row">
                <div className="col-4">
                  <div className="text-center mb-3">
                    <img
                      style={{
                        width: "auto",
                        height: "15vh",
                        borderRadius: "2%",
                      }}
                      src={data.url ? data.url : "images/profile/1.jpg"}
                      alt="Image"
                      className="img-fluid shadow-sm"
                    />
                  </div>
                </div>
                <div className="col-6 ml-2">
                  <div className="mt-1 row">
                    <p className="text-primary text-bold">
                      <span className="text-secondary">Identifiant : </span>
                      {data.nom_login}
                    </p>
                  </div>
                  <div className="mt-1 row">
                    <p className="text-primary text-bold">
                      <span className="text-secondary">Affiliation : </span>
                      {data.type_utilisateur}
                    </p>
                  </div>
                  <hr />
                  <div className="mt-1 row">
                    <p className="text-primary text-bold">
                      <span className="text-secondary">Nom et prénom : </span>
                      {data.nom_utilisateur}
                    </p>
                  </div>
                  <div className="mt-1 row">
                    <p className="text-primary text-bold">
                      <span className="text-secondary">Sexe : </span>
                      {data.sexe}
                    </p>
                  </div>
                  <div className="mt-1 row">
                    <p className="text-primary text-bold">
                      <span className="text-secondary">Contact : </span>
                      {data.contact}
                    </p>
                  </div>
                  {/* <div className="mt-1 row">
                    <p className="text-primary text-bold">
                      <span className="text-secondary">Adress : </span>
                      {data.adress}
                    </p>
                  </div> */}
                  <div className="mt-1 row">
                    <p className="text-primary text-bold">
                      <span className="text-secondary">Email : </span>
                      {data.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Viewer;
