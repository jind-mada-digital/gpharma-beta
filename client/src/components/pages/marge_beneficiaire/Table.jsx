import { faEdit, faListAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useRecoilState } from "recoil";
import {
  isAddState,
  listMarge_beneficiaire,
  marge_beneficiaireSelect,
} from "../../../atoms/marge_beneficiaire";
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
  const [list, setList] = useRecoilState(listMarge_beneficiaire);
  const [marge_beneficiaireSelected, seMarge_beneficiaireSelected] =
    useRecoilState(marge_beneficiaireSelect);
  const columns = [
    {
      name: "#",
      selector: (row) => list.indexOf(row) + 1,
      sortable: true,
      width: "8%",
    },
    {
      name: "Marge bénéficiaire",
      selector: (row) => row.marge_beneficiaire,
      sortable: true,
    },
    {
      name: "Activé",
      selector: (row) => (
        <div className="custom-control custom-checkbox m-1">
          <input
            type="checkbox"
            className="custom-control-input"
            id={"customCheckBox" + row.id}
            checked={row.active == "1" ? true : false}
            onChange={() => {
              if (row.active == "0") {
                updateData(
                  "marge_beneficiaire/active",
                  row.id,
                  { active: "1", status: "1" },
                  getAll
                );
              }
            }}
          />
          <label
            className="custom-control-label"
            htmlFor={"customCheckBox" + row.id}
          />
        </div>
      ),
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
                "marge_beneficiaireStatus",
                row.id,
                {
                  status: row.status == "0" ? "1" : "0",
                },
                getAll
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
              data-target="#modalmarge_beneficiaire"
              handleClick={() => {
                getData(
                  "marge_beneficiaire",
                  (data) => {
                    seMarge_beneficiaireSelected(data);
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
                    deleteData("marge_beneficiaire", row.id, getAll);
                  }
                );
              }}
            />
          </>
        );
      },
    },
  ];
  const getAll = () => {
    getData("marge_beneficiaire", setList);
  };
  React.useEffect(() => {
    getAll();
  }, []);
  return (
    <>
      <MyDataTable
        columns={columns}
        data={list}
        title="Liste des marges bénéficiaires"
        filterClass="form-control w-100"
        actions={
          <>
            <button
              className="btn btn-sm btn-primary"
              data-toggle="modal"
              data-target="#modalmarge_beneficiaire"
            >
              <i className="fa fa-plus mr-2"></i> Ajouter une marge bénéficiaire
            </button>
            {/* <button
              className="btn btn-sm btn-outline-warning "
              data-toggle="modal"
              data-target="#modalmarge_beneficiaireActivity"
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
