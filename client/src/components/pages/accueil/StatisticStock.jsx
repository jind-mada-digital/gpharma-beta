import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, ArcElement, registerables } from "chart.js";
import { urlRead } from "../../../utils/utils";
import axios from "axios";
import { userConnected } from "../../../atoms/authentication";
import { useRecoilState } from "recoil";

Chart.register(...registerables);
Chart.register(ArcElement);

function StatisticStock() {
  const [StatStock, setStatStock] = React.useState()
  const dataBar = {
    labels: [
      "Produits de santé en étalé",
      "Produits de santé en stock",
      "Stock minimum",
      "Stock maximum",
      "Produits prérimés",
    ],
    datasets: [
      {
        label: "Nombre",
        data: StatStock,
        backgroundColor: [
          "rgba(255, 159, 64, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: [
          "rgb(255, 159, 64)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
          "rgb(54, 162, 235)",
          "rgb(255, 99, 132)",
        ],
        borderWidth: 2,
      },
    ],
  };
  const getStatStock = async () => {
    let data = await axios.get(urlRead("accueil/StatStock"));
    data = data.data[0];
    setStatStock([data.count_etale, data.count_stock, data.count_min, data.count_max, data.count_perime]);
  };
  useEffect(() => {
    getStatStock();
  }, []);
  return (
    <>
      <Bar
        style={{
          position: "relative",
          height: "15vh",
          width: "40vw",
        }}
        data={dataBar}
        options={{ plugins: { legend: { display: false } } }}
      />
    </>
  );
}

export default StatisticStock;
