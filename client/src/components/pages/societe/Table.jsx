import { faEdit, faListAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useRecoilState } from "recoil";
import { isAddState, listSociete, societeSelect } from "../../../atoms/societe";
import MyDataTable from "../../../utils/mydatatable/MyDataTable";
import {
  ButtonTable,
  confirmDelete,
  deleteData,
  getData,
  updateData,
} from "../../../utils/utils";

function Table() {
  const [isAdd, setIsAdd] = useRecoilState(isAddState);
  const [list, setList] = useRecoilState(listSociete);
  const [societeSelected, setSocieteSelected] = useRecoilState(societeSelect);
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "8%",
    },
    {
      name: "Société",
      selector: (row) => row.nom_societe,
      sortable: true,
    },
    {
      name: "Prise en charge",
      selector: (row) => row.prise_en_charge + " %",
      sortable: true,
      width: "20%",
    },
    {
      name: "Etat",
      selector: (row) => (
        <div className="text-center">
          <span
            style={{ cursor: "pointer" }}
            className={
              row.status == "0"
                ? "badge light badge-warning"
                : "badge light badge-success"
            }
            onClick={() => {
              updateData(
                "SocieteStatus",
                row.id,
                {
                  status: row.status == "0" ? "1" : "0",
                },
                () => {
                  getData("societe", setList);
                }
              );
            }}
          >
            <i
              className={
                row.status == "0"
                  ? "fa fa-circle text-warning mr-1"
                  : "fa fa-circle text-success mr-1"
              }
            />
            {row.status == "0" ? "Désactivée" : "Activée"}
          </span>
        </div>
      ),
      sortable: true,
      width: "15%",
    },
    {
      name: "Action",
      width: "150px",
      selector: (row) => {
        return (
          <>
            <ButtonTable
              importance="warning mr-2"
              icon={faEdit}
              data-toggle="modal"
              data-target="#modalSociete"
              handleClick={() => {
                getData(
                  "societe",
                  (data) => {
                    setSocieteSelected(data);
                    setIsAdd({ status: false });
                  },
                  row.id
                );
              }}
            />
            <ButtonTable
              importance="danger"
              icon={faTrash}
              handleClick={() => {
                confirmDelete(
                  "Voulez-vous vraiment supprimer cette société?",
                  () => {
                    deleteData("societe", row.id, () => {
                      getData("societe", setList);
                    });
                  }
                );
              }}
            />
          </>
        );
      },
    },
  ];
  React.useEffect(() => {
    getData("societe", setList);
  }, []);
  return (
    <>
      <MyDataTable
        columns={columns}
        data={list}
        title="Liste des sociétés"
        filterClass="form-control w-100"
        actions={
          <>
            <button
              className="btn btn-sm btn-primary"
              data-toggle="modal"
              data-target="#modalSociete"
            >
              <i className="fa fa-plus mr-2"></i> Ajouter une société
            </button>
            {/* <button
              className="btn btn-sm btn-outline-warning "
              data-toggle="modal"
              data-target="#modalSocieteActivity"
            >
              <i className="fa fa-list-alt mr-2"></i> Activité
            </button> */}
          </>
        }
      />
    </>
  );
}

export default Table;
