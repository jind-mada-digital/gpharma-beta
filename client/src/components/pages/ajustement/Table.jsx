import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useRecoilState } from "recoil";
import {
  listAjustement,
  ajustementSelect,
  isAddState,
} from "../../../atoms/ajustement";
import MyDataTable from "../../../utils/mydatatable/MyDataTable";
import { ButtonTable, getData } from "../../../utils/utils";

function Table() {
  const [isAdd, setIsAdd] = useRecoilState(isAddState);
  const [list, setList] = useRecoilState(listAjustement);
  const [ajustementSelected, setAjustementSelected] =
    useRecoilState(ajustementSelect);
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
      name: "Date",
      selector: (row) => row.date_ajustement,
      sortable: true,
    },
    {
      name: "Emplacement",
      selector: (row) => row.emplacement.nom_emplacement,
      sortable: true,
    },
    {
      name: "Efféctuer par",
      selector: (row) => row.utilisateur.nom_utilisateur,
      sortable: true,
    },
    {
      name: "Action",
      width: "150px",
      selector: (row) => {
        return (
          <>
            <ButtonTable
              importance="success"
              icon={faListAlt}
              data-toggle="modal"
              data-target="#modalView"
              handleClick={() => {
                getData("ajustement", setAjustementSelected, row.id);
              }}
            />
          </>
        );
      },
    },
  ];
  React.useEffect(() => {
    getData("ajustement", setList);
  }, []);
  return (
    <>
      <MyDataTable
        columns={columns}
        data={list}
        title="Liste des ajustements efféctuées"
        filterClass="form-control w-100"
        actions={
          <button
            className="btn btn-sm btn-primary"
            data-toggle="modal"
            data-target="#modalAjustement"
            onClick={() => {
              setIsAdd("1");
            }}
          >
            <i className="fa fa-plus mr-2"></i> Effectuer un ajustement
          </button>
        }
      />
    </>
  );
}

export default Table;
