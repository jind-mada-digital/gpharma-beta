import React, { useEffect, useState } from "react";
import { urlRead, getData } from "../../../utils/utils";
import { userConnected } from "../../../atoms/authentication";
import { useRecoilState } from "recoil";
import MyDataTable from "../../../utils/mydatatable/MyDataTable";

import { listProduit } from "../../../atoms/produit";

function TopFiveSoldProduct() {
  const [topFiveList, setTopFiveList] = useState([]);

  React.useEffect(() => {
    getData("modules/default/ventes/best-seller", (data) => {
      // const stock_filtered = data.filter(function (d) {console.log(d);
      //   return d.unite_stock < 10;
      // });
      console.log(data)
      setTopFiveList(data);
    });
  }, []);

  console.log(topFiveList)
  const [userConnect, setUserConnect] = useRecoilState(userConnected);

  const caseInsensitiveSort = (rowA, rowB) => {
    const a = rowA.qte_vendu;
    const b = rowB.qte_vendu;

    if (a > b) {
        return -1;
    }

    if (b > a) {
        return 1;
    }

    return 0;
  };
  const columns_top_five = [
    {
      name: "#",
      selector: (row) => row.produit.code_lot_produit,
      sortable: true,
      width: "15%",
    },
    {
      name: "Produits",
      selector: (row) => row.produit.nom_produit,
      sortable: true,
      width: "55%",
    },
    {
      name: "Quantité vendue",
      selector: (row) => row.qte_vendu,
      sortable: true,
      width: "15%",
      sortFunction: caseInsensitiveSort
    },
    {
      name: "Benefice net en Ar",
      selector: (row) => Math.round((row.produit.prix_stock * 1.38 - row.produit.prix_stock) * row.qte_vendu),
      sortable: true,
      width: "15%",
    },
  ];
  const conditionalRowStyles = [
    {
      when: (row) => parseInt(row.qte_vendu) < 5,
      style: {
        // backgroundColor: "#",
        color: "#ad1a0c",
      },
    },
    {
      when: (row) => (parseInt(row.qte_vendu) >= 5) & (parseInt(row.qte_vendu) < 10),
      style: {
        color: "#b46d07",
        // backgroundColor: "",
      },
    },
    {
      when: (row) => parseInt(row.qte_vendu) >= 10,
      style: {
        color: "#2d8d69",
        // backgroundColor: "white",
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
              <div className="card-title">Top 10 Des produits Vendus</div>
              <MyDataTable
                data={topFiveList.slice(0,10)}
                columns={columns_top_five}
                filterClass="form-control w-100"
                // defaultSortFieldId={3}
                conditionalRowStyles={conditionalRowStyles}
              />
            </div>
          </div>
        ) : null}
      </>
    </>
  );
}

export default TopFiveSoldProduct;
