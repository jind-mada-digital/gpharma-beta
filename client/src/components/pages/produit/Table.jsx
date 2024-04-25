import React from "react";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  isAddState,
  listEtalage,
  listProduit,
  produitSelect,
} from "../../../atoms/produit";
import MyDataTable from "../../../utils/mydatatable/MyDataTable";
import {
  ButtonTable,
  confirmDelete,
  deleteData,
  getData,
  getUrl,
  getEmplacement,
  updateData,
} from "../../../utils/utils";
import { useRecoilState } from "recoil";
import { actionEtalage } from "../../../atoms/ravitaillement";

function Table() {
  const [actEtalage, setActEtalage] = useRecoilState(actionEtalage);
  const [list, setList] = useRecoilState(listProduit);
  const [listEtale, setListEtalage] = useRecoilState(listEtalage);
  const [produit, setProduit] = useRecoilState(produitSelect);
  const [isAdd, setIsAdd] = useRecoilState(isAddState);

  const getInfoEmplacement = (finalArr) => {
    return (
      <>
        {getEmplacement(finalArr).map((item) => (
          <div>
            <span className="fs-14 text-warning font-w400">
              #{item.nom_emplacement}({item.quantite_produit})
            </span>
          </div>
        ))}
      </>
    );
  };
  const columns = [
    {
      name: "",
      selector: (row) => (
        <img
          key={row.code_lot_produit + "image"}
          style={{
            height: "5vh",
            verticalAlign: "middle",
            justifyContent: "center",
          }}
          className=" mx-auto d-block"
          styles={{ borderRadius: "5%" }}
          src={
            row.image
              ? getUrl("images/produit", row.image)
              : `images/users/3.jpg`
          }
          alt={`image de ${row.nom_produit}`}
        />
      ),
      sortable: true,
      width: "7%",
    },
    {
      name: "Produit",
      selector: (row) => {
        return (
          <div className=" align-items-center  " key={row.code_lot_produit}>
            <h4 className="text-black">{row.nom_produit}</h4>
            <p className="fs-14 text-primary font-w600">
              #{row.code_lot_produit}
            </p>
            {/* {row.emplacement ? getInfoEmplacement(row.emplacement) : ""} */}
            {/* <span className="fs-14 text-secondary font-w600 text-justify">
            <span className="fs-14 text-warning font-w600">#{"Etalé"}</span>
              {row.classification_produit}
            </span>  */}
          </div>
        );
      },
      sortable: false,
      width: "30%",
    },
    /*   {
      name: "Détails",
      selector: (row) => (
        <div className="d-flex align-items-center mr-auto pr-2">
          <div>
            <p className="mb-sm-2 mb-1 text-black">
              Fabricant{" "}
              <span className="fs-14 text-primary font-w600">
                {row.nom_fabricant}
              </span>
              ,
            </p>
            <p className="mb-sm-2 mb-1 text-black">
              Famille{" "}
              <span className="fs-14 text-secondary font-w600">
                {row.nom_famille}
              </span>
              ,
            </p>
            <p className="mb-sm-2 mb-1 text-black">
              Forme{" "}
              <span className="fs-14 text-warning font-w600">
                {row.nom_forme}
              </span>
              .
            </p>
          </div>
        </div>
      ),
      width: "18%",
    }, */
    {
      name: "Unités",
      selector: (row) => (
        <div
          className="d-flex align-items-center mr-auto pr-2"
          key={row.code_lot_produit + "unite"}
        >
          <div>
            {/* <p className="mb-sm-2 mb-1 text-black">
              Unité d'achat :{" "}
              <span className="fs-14 text-primary font-w600">
                {row.nom_achat}
              </span>
              ,
            </p>
            <p className="mb-sm-2 mb-1 text-black">
              Unité de vente :{" "}
              <span className="fs-14 text-secondary font-w600">
                {row.nom_vente}
              </span>
              ,
            </p> */}
            <p className="mb-sm-2 mb-1 text-black">
              Unité de stock :{" "}
              <span className="fs-14 text-warning font-w600">
                {row.nom_stock}
              </span>
              ,
            </p>
            <p className="mb-sm-2 mb-1 text-black">
              Presentation :{" "}
              <span className="fs-14 text-primary font-w600">
                {row.nom_presentation}
              </span>
              ,
            </p> 
            {/* <p className="mb-sm-2 mb-1 text-black">
              Famille{" "}
              <span className="fs-14 text-secondary font-w600">
                {row.nom_famille}
              </span>
              ,
            </p>
            <p className="mb-sm-2 mb-1 text-black">
              Forme{" "}
              <span className="fs-14 text-warning font-w600">
                {row.nom_forme}
              </span>
              .
            </p> */}
          </div>
        </div>
      ),
      width: "20%",
    },
    {
      name: "Dépôt",
      selector: (row) => row.emplacement ? getEmplacement(row.emplacement)[0]?.quantite_produit : "",
      sortable: true, 
      width: "10%",
    },
    {
      name: "Etalage",
      selector: (row) => row.emplacement ? getEmplacement(row.emplacement)[1]?.quantite_produit : "",
      sortable: true, 
      width: "10%",
    },
    {
      name: "Statut",
      selector: (row) => (
        <div className="text-center" key={row.code_lot_produit + "status"}>
          <span
            style={{ cursor: "pointer" }}
            className={
              row.status == "1"
                ? "badge light badge-success"
                : row.status == "0"
                ? "badge light badge-warning"
                : "badge light badge-danger"
            }
            onClick={() => {
              if (row.status != "2") {
                const getStatus = (status) => {
                  if (status == "1") return "0";
                  else if (status == "0") return "1";
                };
                updateData(
                  "produit/status",
                  row.code_lot_produit,
                  { status: getStatus(row.status) },
                  () => {
                    getData("produit", setList);
                  }
                );
              }
            }}
          >
            <i
              className={
                row.status == "1"
                  ? "fa fa-circle text-success mr-1"
                  : row.status == "0"
                  ? "fa fa-circle text-warning mr-1"
                  : "fa fa-circle text-danger mr-1"
              }
            />
            {row.status == "1"
              ? "Activé"
              : row.status == "0"
              ? "Désactivé"
              : "Périmé"}
          </span>
        </div>
      ),
      sortable: true,
      width: "10%",
    },
    {
      name: "Action",
      width: "15%",
      selector: (row) => {
        return (
          <div key={row.code_lot_produit + "btnOption"}>
            <ButtonTable
              importance="secondary"
              icon={faEye}
              data-toggle="modal"
              data-target="#modalViewProduit"
              handleClick={() => {
                getData(
                  "produit",
                  (data) => setProduit(data[0]),
                  row.code_lot_produit
                );
              }}
            />
            <ButtonTable
              importance="warning"
              icon={faEdit}
              data-toggle="modal"
              data-target="#modalProduit"
              handleClick={() => {
                setIsAdd({ status: false });
                getData(
                  "produit",
                  (data) => setProduit(data[0]),
                  row.code_lot_produit
                );
              }}
            />
            <ButtonTable
              importance="danger"
              icon={faTrash}
              handleClick={() => {
                confirmDelete(
                  <>
                    Voulez-vous vraimment supprimé le produit{" "}
                    <b>{row.nom_produit}</b> ?<br />
                    Par cette action vous supprimerez le produit en{" "}
                    <b>stock principale</b> et à l'<b>étalage</b>.
                  </>,
                  () => {
                    deleteData("produit", row.code_lot_produit, () => {
                      getData("produit", setList);

                      getData("produitEtalage", (data) => {
                        setListEtalage(data);
                      });
                    });
                  }
                );
              }}
            />
          </div>
        );
      },
    },
  ];
  React.useEffect(() => {
    getData("produit", (data) => {
      setList(data);
    });
  }, []);
  return (
    <div className="card-body">
      <MyDataTable
        title="Liste des produits"
        data={list}
        columns={columns}
        filterClass="form-control w-100"
        actions={
          <div className="btn-group float-right">
            <button
              className="btn btn-primary btn-sm mr-3"
              data-toggle="modal"
              data-target="#modalProduit"
              onClick={() => {
                setIsAdd({ status: true });
                setActEtalage({ status: true });
              }}
            >
              <i className="fa fa-plus mr-3" />
              Ajout d'un produit
            </button>
            <button
              className="btn btn-outline-warning btn-sm"
              data-toggle="modal"
              data-target="#modalEtalage"
              onClick={() => {
                setActEtalage({ status: true });
              }}
            >
              <i className="fa fa-list-alt mr-3"></i>Etalage
            </button>
          </div>
        }
      />
    </div>
  );
}

export default Table;
