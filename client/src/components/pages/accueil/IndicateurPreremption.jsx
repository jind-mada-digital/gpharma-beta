import React, { useEffect, useState } from "react";
import { urlRead, getData } from "../../../utils/utils";
import { userConnected } from "../../../atoms/authentication";
import { useRecoilState } from "recoil";
import MyDataTable from "../../../utils/mydatatable/MyDataTable";

import { listProduit } from "../../../atoms/produit";

function IndicateurPreremption() {
  const [preremptionList, setpreremptionList] = useState([]);
  let date = new Date();

  React.useEffect(() => {
    getData("produit", (data) => {
      // const prod_preremption_filtered = data.filter(function (d) {
      //   return (new Date(d.date_peremption) - date) <= 5068206124;
      // });

      setpreremptionList(data);
    });
  }, []);
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

  const [userConnect, setUserConnect] = useRecoilState(userConnected);

  const columns_preremption = [
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
      name: "Date",
      selector: (row) => row.date_peremption,
      sortable: true,
      width: "15%",
    },
  ];
  const conditionalRowStyles = [
    {
      when: (row) => (new Date(row.date_peremption) < date),
      style: {
        // backgroundColor: "",
        color: "#ad3a0c",
      },
    },
    {
      when: (row) => (new Date(row.date_peremption) >= date),
      style: {
        color: "#b46d07",
        // backgroundColor: "",
      },
    },
  ];

  return (
    <>
      <>
        {userConnect.type_utilisateur == "ADMIN" ? (
          <div className="col-md-12 col-sm-12">
            <div className="card align-items-center shadow-sm">
              <div className="card-title">Indicateur de Péremption</div>
              <MyDataTable
                data={preremptionList}
                columns={columns_preremption}
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

export default IndicateurPreremption;
