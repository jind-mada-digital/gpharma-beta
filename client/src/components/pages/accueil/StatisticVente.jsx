import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line, Pie, PolarArea } from "react-chartjs-2";
import { Chart, ArcElement, registerables } from "chart.js";
import { urlRead } from "../../../utils/utils";
import axios from "axios";
import { userConnected } from "../../../atoms/authentication";
import { useRecoilState } from "recoil";

Chart.register(...registerables);
Chart.register(ArcElement); 

function StatisticVente({ choose_option, date_selected }) {
  const [userConnect, setUserConnect] = useRecoilState(userConnected);
  const [StatVente1, setStatVente1] = useState([]);
  const [StatVente2, setStatVente2] = useState([]);
  const [StatVente3, setStatVente3] = useState([]);
  let dataLine = [
    {
      labels: StatVente1[0],
      datasets: [
        {
          label: "Montant total des ventes",
          data: StatVente1[1],
          backgroundColor: ["rgb(95, 191, 145)"],
          hoverOffset: 4,
        },
      ],
    },
    {
      labels: StatVente2[0],
      datasets: [
        {
          label: "Nombre de produits vendus",
          data: StatVente2[1],
          backgroundColor: ["rgb(255, 99, 132)"],
          hoverOffset: 4,
        },
      ],
    },
    {
      labels: StatVente3[0],
      datasets: [
        {
          label: "Bénéfices réalisés",
          data: StatVente3[1],
          backgroundColor: ["rgb(255, 212, 57)"],
          hoverOffset: 4,
        },
      ],
    },
  ];
  const getStatVente = async () => {
    if (userConnect.type_utilisateur == "ADMIN") { 
      let dataV = await axios.get(
        urlRead(
          "accueil/StatVente/" +
            (choose_option?.value ?? 0) +
            "/" +
            date_selected
        )
      );
      dataV = dataV.data;  
      let labelCountVente1 = [];
      let dataCountVente1 = [];
      for (const key in dataV[0]) {
        labelCountVente1.push(key);
        dataCountVente1.push(dataV[0][key]);
      }
      let labelCountVente2 = [];
      let dataCountVente2 = [];
      for (const key in dataV[1]) {
        labelCountVente2.push(key);
        dataCountVente2.push(dataV[1][key]??0);
      }
      let labelCountVente3 = [];
      let dataCountVente3 = [];
      for (const key in dataV[2]) {
        labelCountVente3.push(key);
        dataCountVente3.push(dataV[2][key]);
      }
      setStatVente1(
        [labelCountVente1, dataCountVente1]
      );
      setStatVente2(
        [labelCountVente2, dataCountVente2]
      );
      setStatVente3(
        [labelCountVente3, dataCountVente3]
      );
      console.log(StatVente1, StatVente2, StatVente3);
    }
  };
  useEffect(() => { 
    getStatVente();
  }, [choose_option, date_selected]);
  return (
    <>
      <div className="row m-3">
        <div className="  d-flex justify-content-center">
          <div className="row">
            <div className="col-xl-6 col-sm-12">
              <Bar
                style={{
                  position: "relative",
                  height: "15vh",
                  width: "40vw",
                }}
                data={dataLine[0]}
              />
            </div>
            <div className="col-xl-6 col-sm-12">
              <Line
                style={{
                  position: "relative",
                  height: "15vh",
                  width: "40vw",
                }}
                data={dataLine[1]}
              />
            </div>
            <div className="col-xl-6 col-sm-12">
              <Bar
                style={{
                  position: "relative",
                  height: "15vh",
                  width: "40vw",
                }}
                data={dataLine[2]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StatisticVente;
