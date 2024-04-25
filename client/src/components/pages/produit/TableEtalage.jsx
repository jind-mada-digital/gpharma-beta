import React from "react";
import { useRecoilState } from "recoil";
import { listEtalage, produitSelect } from "../../../atoms/produit";
import MyDataTable from "../../../utils/mydatatable/MyDataTable";
import { ButtonTable, getData, getEmplacement } from "../../../utils/utils";

function TableEtalage() {
  const [list, setList] = useRecoilState(listEtalage);
  const [produit, setProduit] = useRecoilState(produitSelect);

  const columns = [
    {
      name: "#",
      selector: (row) => (
        <span className="fs-14 text-black font-w600">
          #{row.code_lot_produit}
        </span>
      ),
      sortable: true,
      width: "12%",
    },
    {
      name: "Produit",
      selector: (row) => {
        return (
          <div className=" align-items-center  ">
            <h5 className="text-black">{row.nom_produit}</h5>
          </div>
        );
      },
      sortable: true,
      // width: "200px",
    },
    {
      name: "Etalé",
      selector: (row) => (
        <div className="d-flex align-items-center mr-auto pr-2">
          <div>
            <span className="fs-14 text-secondary font-w600">
              {row.emplacement ? (
                <>
                  {JSON.parse(row.emplacement.slice(0, -6)).quantite_produit}{" "}
                  <br /> {row.nom_vente}
                </>
              ) : (
                "0"
              )}
            </span>
          </div>
        </div>
      ),
      sortable: true,
      width: "12%",
    },
    {
      name: "Unités",
      selector: (row) => (
        <div className="d-flex align-items-center mr-auto pr-2">
          <div>
            <p className="mb-sm-2 mb-1 text-black">
              Unité de stock :{" "}
              <span className="fs-14 text-warning font-w600">
                {row.nom_stock}
              </span>
              .
            </p>
            <p className="mb-sm-2 mb-1 text-black">
              Unité de présentation :{" "}
              <span className="fs-14 text-secondary font-w600">
                {row.nom_presentation}
              </span>
              ,
            </p>
          </div>
        </div>
      ),
      sortable: true,
      // width: "18%",
    },
    {
      name: "Détails",
      selector: (row) => (
        <div className="d-flex align-items-center mr-auto pr-2">
          <div>
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
      // width: "18%",
    },
    // {
    //   name: "Action",
    //   width: "150px",
    //   selector: (row) => {
    //     return (
    //       <>
    //         <ButtonTable
    //           importance="success"
    //           icon={faListAlt}
    //           handleClick={() => {}}
    //         />
    //         <ButtonTable
    //           importance="secondary"
    //           icon={faEye}
    //           data-toggle="modal"
    //           data-target="#modalViewProduit"
    //           handleClick={() => {
    //             getData(
    //               "produit",
    //               (data) => setProduit(data[0]),
    //               row.code_lot_produit
    //             );
    //           }}
    //         />
    //       </>
    //     );
    //   },
    // },
  ];
  React.useEffect(() => {
    getData("produitEtalage", (data) => {
      setList(data);
    });
  }, []);
  return (
    <>
      <MyDataTable
        // title="Liste des produits"
        data={list}
        columns={columns}
        filterClass="w-100 form-control"
      />
    </>
  );
}

export default TableEtalage;
