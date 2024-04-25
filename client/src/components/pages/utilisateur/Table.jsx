import React from "react";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import MyDataTable from "../../../utils/mydatatable/MyDataTable";
import { ButtonTable } from "../../../utils/utils";
// rounded-circle
function Table({ update, del, view, list, isAdd }) {
  const columns = [
    {
      name: "",
      selector: (row) => (
        <img
          style={{ height: "5vh", verticalAlign: "middle" }}
          className="img-fluid"
          styles={{ borderRadius: "5%" }}
          src={row.url ? row.url : `images/users/1.jpg`}
          alt={`image de ${row.nom_utilisateur}`}
        />
      ),
      sortable: true,
      width: "10%",
    },
    {
      name: "Identifiant",
      selector: (row) => row.nom_login,
      sortable: true,
      width: "10%",
    },
    {
      name: "Nom et prénom",
      selector: (row) => row.nom_utilisateur,
      sortable: true,
    },
    {
      name: "Est",
      selector: (row) =>(
        <div className="text-center">
          <span
            className={
              row.isOnline == "0"
                ? "badge light badge-dark"
                : "badge light badge-success"
            }
          >
            <i
              className={
                row.isOnline == "0"
                  ? "fa fa-circle text-dark mr-1"
                  : "fa fa-circle text-success mr-1"
              }
            />
            {row.isOnline == "0" ? "Déconnecté" : "En ligne"}
          </span>
        </div>
      ),
      sortable: true,
      width: "15%",
    },
    {
      name: "Date dernière connexion",
      selector: (row) => row.date_der_log,
      sortable: true,
      width: "20%",
    },
    {
      name: "Contact",
      selector: (row) => row.contact,
      sortable: true,
      width: "15%",
    },
    {
      name: "Action",
      width: "200px",
      selector: (row) => (
        <div className="btn-group">
          <ButtonTable
            importance="secondary"
            icon={faEye}
            data-toggle="modal"
            data-target="#viewUtilisateur"
            handleClick={() => view(row.id)}
          />
          <ButtonTable
            importance="warning "
            icon={faEdit}
            data-toggle="modal"
            data-target="#modalUtilisateur"
            handleClick={() => {
              isAdd(false);
              update(row.id);
            }}
          />
          <ButtonTable
            importance="danger "
            icon={faTrash}
            handleClick={() => del(row.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <MyDataTable
        title="Listes des utilisateurs"
        filterClass='form-control w-100'
        data={list}
        columns={columns}
        actions={
          <button
            type="button"
            className="btn btn-sm btn-primary float-right"
            data-toggle="modal"
            data-target="#modalUtilisateur"
            onClick={() => {
              isAdd(true);
            }}
          >
            Ajouter un utilisateur
          </button>
        }
      />
    </div>
  );
}

export default Table;
