import React, { useEffect, useState } from "react";
import { urlRead, getData } from "../../../utils/utils";
import { userConnected } from "../../../atoms/authentication";
import { useRecoilState } from "recoil";
import MyDataTable from "../../../utils/mydatatable/MyDataTable";

import { listProduit } from "../../../atoms/produit";

function RuptureStock() {
  const [stockList, setstockList] = useState([]);

  React.useEffect(() => {
    getData("produit", (data) => {
      // const stock_filtered = data.filter(function (d) {console.log(d);
      //   return d.unite_stock < 10;
      // });
      setstockList(data);
    });
  }, []);

  const [userConnect, setUserConnect] = useRecoilState(userConnected);

  const caseInsensitiveSort = (rowA, rowB) => {
    const a = rowA.unite_vente;
    const b = rowB.unite_vente;

    if (a > b) {
      return -1;
    }

    if (b > a) {
      return 1;
    }

    return 0;
  };
  const columns_stock = [
    {
      name: "#",
      selector: (row) => row.code_lot_produit,
      sortable: true,
      width: "15%",
    },
    {
      name: "Produits",
      selector: (row) => row.nom_produit,
      sortable: true,
      width: "70%",
    },
    {
      name: "Qt restente",
      selector: (row) => row.unite_stock,
      sortable: true,
      width: "15%",
    },
  ];
  const conditionalRowStyles = [
    {
      when: (row) => parseInt(row.unite_stock) < 5,
      style: {
        // backgroundColor: "",
        color: "#ad3a0c",
      },
    },
    {
      when: (row) => (parseInt(row.unite_stock) >= 5) & (parseInt(row.unite_stock) < 10),
      style: {
        color: "#b46d07",
        // backgroundColor: "",
      },
    },
    {
      when: (row) => parseInt(row.unite_stock) >= 10,
      style: {
        color: "#2d8d69",
        // backgroundColor: "",
      },
    },
  ];

  // useEffect(() => {
  //   getAll();
  // }, []);

  return (
    <>
      <>
        {userConnect.type_utilisateur == "ADMIN" ? (
          <div className="col-md-12 col-sm-12">
            <div className="card align-items-center shadow-sm">
              <div className="card-title">Rupture de stock</div>
              <MyDataTable
                data={stockList}
                columns={columns_stock}
                filterClass="form-control w-100"
                defaultSortFieldId={3}
                conditionalRowStyles={conditionalRowStyles}
              />
            </div>
          </div>
        ) : null}
      </>
    </>
  );
}

export default RuptureStock;
