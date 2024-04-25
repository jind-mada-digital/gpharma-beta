import {
  faEdit,
  faEye,
  faListAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { userConnected } from "../../../atoms/authentication";
import { venteSelect, isAddState } from "../../../atoms/caisse";
import MyDataTable from "../../../utils/mydatatable/MyDataTable";
import {
  ButtonTable,
  confirmDelete,
  deleteData,
  getData,
  getUrl,
  numberWithCommas,
  urlRead,
} from "../../../utils/utils";

function Table() {
  const [userConnect, setUserConnect] = useRecoilState(userConnected);
  const [isAdd, setIsAdd] = useRecoilState(isAddState);
  const [venteSelected, setVenteSelected] = useRecoilState(venteSelect);
  const [list, setList] = useState([]);
  const [moveIconDown, setMoveIconDown] = useState(true);

  const [downloadFacture, setDownloadFacture] = React.useState({
    vente_id: "",
    url: "",
  });
  const generatePdf = (id) => {
    const get = async () => {
      try {
        const response = await axios.get(urlRead("download/pdf/vente", id));
        if (response.status === 200) {
          setDownloadFacture((prev) => ({
            ...prev,
            url: getUrl("pdf/vente/facture", response.data.url),
          }));
        }
      } catch (error) {
        setDownloadFacture({
          vente_id: "",
          url: "",
        });
        toast.error("Une erreur est survenue !");
      }
    };
    toast.promise(get, {
      pending: `Génération de la facture de vente #${id} en cours ...`,
      // success: "Promise  Loaded",
      error: `Une erreur de chargement est survenue !`,
    });
  };

  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "12%",
    },
    {
      name: "Motif",
      selector: (row) => row.motif,
      sortable: true,
      // width: "30%",
    },
    {
      name: "Client",
      selector: (row) => row.client.nom_prenom,
      sortable: true,
    },
    {
      name: "Date de vente",
      selector: (row) => row.date_vente,
      sortable: true,
    },
    {
      name: "Montant total en Ariary",
      selector: (row) => numberWithCommas(row.montant_total),
      sortable: true,
    },
    {
      name: "Etat",
      selector: (row) => (
        <div className="text-center">
          <span
            className={
              row.etat_vente == "0"
                ? "badge light badge-warning"
                : "badge light badge-success"
            }
          >
            <i
              className={
                row.etat_vente == "0"
                  ? "fa fa-circle text-warning mr-1"
                  : "fa fa-circle text-success mr-1"
              }
            />
            {row.etat_vente == "0" ? "Commandée" : "Livrée"}
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
          <div className="row m-auto">
            <div className=" ">
              {downloadFacture.vente_id == row.id && downloadFacture.url ? (
                <a
                  id={"btnFileDownload_" + row.id}
                  href={downloadFacture.url}
                  target="_blank"
                  download="facture"
                  className="btn btn-secondary btn-sm light"
                  onClick={() => {
                    setMoveIconDown(false);
                  }}
                  title="voir la facture en PDF">
                  <i
                    className={
                      moveIconDown
                        ? "fa fa-download fa-bounce"
                        : "fa fa-download"
                    }
                  ></i>
                </a>
              ) : (
                <button
                  title="Télécharger la facture en PDF"
                  className={
                    downloadFacture.vente_id == row.id
                      ? "btn btn-warning btn-sm light"
                      : "btn btn-warning btn-sm light"
                  } /* disabled */
                  onClick={() => {
                    if (
                      // downloadFacture.url &&
                      // downloadFacture.vente_id != row.id 
                      true
                    ) {
                      setDownloadFacture({
                        vente_id: row.id,
                        url: "",
                      });
                      setMoveIconDown(true);
                      console.log("downloadFacture", downloadFacture, row.id);
                      generatePdf(row.id);
                    }
                  }}
                  >
                  <i
                    className={
                      downloadFacture.vente_id == row.id
                        ? "fa-solid fa-circle-notch fa-spin "
                        : "fa fa-clipboard-list "
                    }
                  ></i>
                </button>
              )}
            </div>
            <ButtonTable
              importance={"success btn-sm"}
              icon={faListAlt}
              data-toggle="modal"
              data-target="#modalViewVente"
              handleClick={() => {
                getData(
                  "vente/details",
                  (data) => {
                    setVenteSelected(data);
                    console.log(venteSelected);
                  },
                  row.id
                );
              }}
            />
            {/* <ButtonTable
              importance="danger"
              icon={faTrash}
              handleClick={() => {
                confirmDelete(
                  <>
                    Voulez-vous vraimment supprimé le guichet{" "}
                    <strong>{row.motif}</strong> ?
                  </>,
                  () => {
                    deleteData("guichet", row.id, () => {
                      getData("guichet", setList);
                    });
                  }
                );
              }}
            /> */}
          </div>
        );
      },
    },
  ];
  React.useEffect(() => {
    getData("vente/myCaisse", (data) => setList(data), userConnect.id);
  }, []);
  return (
    <>
      <MyDataTable
        columns={columns}
        data={list}
        title="Liste des ventes efféctuées"
        filterClass="form-control w-100"
        actions={
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setIsAdd("1");
            }}
          >
            <i className="fa fa-plus mr-2"></i> Valider une vente
          </button>
        }
      />
    </>
  );
}

export default Table;
