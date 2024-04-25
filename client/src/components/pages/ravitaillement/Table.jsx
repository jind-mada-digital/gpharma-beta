import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useRecoilState } from "recoil";
import {
  listRavitaillement,
  toggleAddTableEdit,
  ravitaillementSelect,
} from "../../../atoms/ravitaillement";
import MyDataTable from "../../../utils/mydatatable/MyDataTable";
import {
  ButtonTable,
  confirmDelete,
  deleteData,
  getData,
} from "../../../utils/utils";

function Table() {
  const [toggle, setToggle] = useRecoilState(toggleAddTableEdit);
  const [list, setList] = useRecoilState(listRavitaillement);
  const [rvtSelect, setRvtSelect] = useRecoilState(ravitaillementSelect);
  const columns = [
    {
      name: "#",
      selector: (row) => list.indexOf(row) + 1,
      sortable: true,
      width: "8%",
    },
    {
      name: "Motif",
      selector: (row) => row.motif,
      sortable: true,
      width: "30%",
    },
    {
      name: "Fournisseur",
      selector: (row) => row.fournisseur.nom_fournisseur,
      sortable: true,
    },
    {
      name: "Efféctuer par",
      selector: (row) => row.utilisateur.nom_utilisateur,
      sortable: true,
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
      width: "150px",
      selector: (row) => {
        return (
          <>
            <ButtonTable
              importance={
                row.etat_ravitaillement === "COMMANDE" ? "warning" : "secondary"
              }
              icon={row.etat_ravitaillement === "COMMANDE" ? faEdit : faEye}
              handleClick={() => {
                if (row.etat_ravitaillement === "COMMANDE") {
                  setRvtSelect({ id: row.id, etat_ravitaillement: "COMMANDE" });
                  setToggle(2);
                }else{
                  setRvtSelect({ id: row.id, etat_ravitaillement: "LIVREE" });
                  document.getElementById('btn-view-modal').click();
                }
              }}
            />
            {/* <ButtonTable
              importance="danger"
              icon={faTrash}
              handleClick={() => {
                confirmDelete(
                  <>
                    Voulez-vous vraimment supprimé le ravitaillement{" "}
                    <strong>{row.motif}</strong> ?
                  </>,
                  () => {
                    deleteData("ravitaillement", row.id, () => {
                      getData("ravitaillement", setList);
                    });
                  }
                );
              }}
            /> */}
          </>
        );
      },
    },
  ];
  React.useEffect(() => {
    getData("ravitaillement", (data) => setList(data));
  }, []);
  return (
    <>
      <MyDataTable
        columns={columns}
        data={list}
        title="Liste des ravitaillements efféctuées"
        filterClass="form-control w-100"
        actions={
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              let a = 0;
              if (toggle === 0) a = 1;
              setToggle(a);
            }}
          >
            <i className="fa fa-plus mr-2"></i> Efféctuer un ravitaillement
          </button>
        }
      />
    </>
  );
}

export default Table;
