import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { redirect } from "react-router-dom";
import MyDataTable from "../../../utils/mydatatable/MyDataTable";
import {
  ButtonTable,
  confirmDelete,
  deleteData,
  getData,
  getUrl,
} from "../../../utils/utils";

function TableActivity() {
  const [list, setList] = React.useState([]);
  const columns = [
    {
      name: "Ravitaillement",
      selector: (row) => row.motif,
      sortable: true,
      width: "30%",
    },
    {
      name: "Montant Totals",
      selector: (row) => <>{row.montant_ht} Ar</>,
      sortable: true,
      //   width: "30%"
    },
    {
      name: "Fournisseur",
      selector: (row) => (
        <div className="text-justify">
          #{row.fournisseur.sigle} <br />{row.fournisseur.nom_fournisseur}
        </div>
      ),
      sortable: true,
      width: "25%",
    },
    {
      name: "Etat",
      selector: (row) => (
        <div className="text-center">
          <span
            className={
              row.etat_ravitaillement == "COMMANDE"
                ? "badge light badge-warning"
                : "badge light badge-success"
            }
          >
            <i
              className={
                row.etat_ravitaillement == "COMMANDE"
                  ? "fa fa-circle text-warning mr-1"
                  : "fa fa-circle text-success mr-1"
              }
            />
            {row.etat_ravitaillement === "COMMANDE" ? "Commandée" : "Livrée"}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Action",
      width: "80px",
      selector: (row) => {
        return (
          <>
            <ButtonTable
              importance="success"
              icon={faListAlt}
              handleClick={() => {
                  document.getElementById("closeModalActivity").click();
                  document.getElementById("idLinkRavitaillement").click();
                // redirect("\ravitaillement")
              }}
            />
          </>
        );
      },
    },
  ];
  useEffect(() => {
    getData("activityFournisseur", setList);
  }, []);

  return ( 
      <MyDataTable
        data={list}
        filterClass={"form-control w-100"}
        columns={columns}
      /> 
  );
}

export default TableActivity;
