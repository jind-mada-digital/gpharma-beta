import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import MyDataTable from "../../../utils/mydatatable/MyDataTable";
import { ButtonTable, confirmDelete, deleteData, getData, getUrl } from "../../../utils/utils";
import { isAddState, listFournisseur, fournisseurSelect } from "../../../atoms/fournisseur";

function Table() {
  const [isAdd, setIsAdd] = useRecoilState(isAddState);
  const [list, setList] = useRecoilState(listFournisseur);
  const [fournisseur, setFournisseur] = useRecoilState(fournisseurSelect);
  const columns = [
    {
      name: "",
      selector: (row) => (
        <img
          style={{ height: "5vh", verticalAlign: "middle" }}
          className="img-fluid"
          styles={{ borderRadius: "5%" }}
          src={row.logo ? getUrl("images/fournisseur", row.logo) : `images/users/1.jpg`}
          alt={`image de ${row.nom_fournisseur}`}
        />
      ),
      sortable: true,
      width: "10%",
    },
    {
      name: "Sigle",
      selector: (row) => row.sigle,
      sortable: true,
      width: "10%",
    },
    {
      name: "Nom",
      selector: (row) => row.nom_fournisseur,
      sortable: true,
    },
    {
      name: "Cont. Sécret.",
      selector: (row) => row.contact_secretaire,
      sortable: true,
      width: "18%",
    },
    /* {
      name: "Email",
      selector: (row) => (row.email),
      sortable: true,
      width: "8%",
    }, */
    {
      name: "Adresse",
      selector: (row) => row.adresse,
      sortable: true,
      width: "18%",
    },
    {
      name: "Action",
      width: "200px",
      selector: (row) => {
        return (
          <>
            <ButtonTable
              importance="secondary"
              icon={faEye}
              data-toggle="modal"
              data-target="#modalViewFournisseur"
              handleClick={() => {
                getData("fournisseur", setFournisseur, row.id);
              }}
            />
            <ButtonTable
              importance="warning"
              icon={faEdit}
              data-toggle="modal"
              data-target="#modalFournisseur"
              handleClick={() => {
                setIsAdd({status:false})
                getData("fournisseur", setFournisseur, row.id); 
              }}
            />
            <ButtonTable
              importance="danger"
              icon={faTrash}
              handleClick={() => {
                confirmDelete(
                  "Voulez-vous vraimment supprimé cet fournisseur ?",
                  () => {
                    deleteData('fournisseur', row.id, ()=>{
                      getData('fournisseur', setList)
                    })
                  }
                );
              }}
            />
          </>
        );
      },
    },
  ];
  useEffect(() => {
    getData("fournisseur", setList);
  }, []);

  return (
    <div className="card-body">
      <MyDataTable
        title="Liste des fournisseurs"
        data={list}
        columns={columns}
        actions={
          <div className="btn-group float-right">
            <button 
              className="btn btn-primary btn-sm mr-3" 
              data-toggle="modal"
              data-target="#modalFournisseur"
              onClick={()=>setIsAdd({status:true})}
              >
              Ajout d'un founrisseur
            </button>
            <button className="btn btn-outline-primary btn-sm"
              data-toggle="modal"
              data-target="#modalActivityFournisseur">
              <i className="fa fa-list-alt mr-3"></i>Activités
            </button>
          </div>
        }
      />
    </div>
  );
}

export default Table;
