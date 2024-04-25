import React, { useEffect, useState } from "react";
import { Doughnut, Line, Pie, PolarArea } from "react-chartjs-2";
import { Chart, ArcElement, registerables } from "chart.js";
import { urlRead,getData } from "../../../utils/utils";
import axios from "axios";
import { userConnected } from "../../../atoms/authentication";
import { useRecoilState } from "recoil";
import RuptureStock from "./RuptureStock"

import IndicateurPreremption from "./IndicateurPreremption";
import TopFiveSoldProduct from "./TopFiveSoldProduct";

Chart.register(...registerables);
Chart.register(ArcElement);

function StatisticGeneral() {

  const [userConnect, setUserConnect] = useRecoilState(userConnected);
  const [StatGeneral, setStatGeneral] = useState({
    count_commande: 0,
    count_livraison: 0,
    count_guichet: 0,
    count_caisse: 0,
    count_rvt_total: 0,
    count_vente_total: 0,
  });
  const {
    count_commande,
    count_livraison,
    count_guichet,
    count_caisse,
    count_rvt_total,
    count_vente_total,
  } = StatGeneral;

  const getAll = async () => {
    const dataG = await axios.get(
      urlRead("accueil/StatGeneral", userConnect.id)
    );
    if (dataG) {
      console.log(dataG.data[0]);
      setStatGeneral(dataG.data[0]);
    }
  };
   
  useEffect(() => {
    getAll();
  }, []);

  let dataDoughnut = {
    labels: userConnect.type_utilisateur == "ADMIN" ?[
      "Commande (Ravitaillement)",
      "Livraison (Ravitaillement)",
      "Guichet (Vente)",
      "Caisse (Vente)",
    ]:[ 
      "Guichet (Vente)",
      "Caisse (Vente)",
    ],
    datasets: [
      {
        data: userConnect.type_utilisateur == "ADMIN" ?[count_commande, count_livraison, count_guichet, count_caisse]:[count_guichet, count_caisse], //[count_commande, count_livraison, count_guichet, count_caisse]
        backgroundColor: userConnect.type_utilisateur == "ADMIN" ?[
          "rgb(95, 116, 191)",
          "rgb(255, 205, 86)",
          "rgb(255, 99, 132)",
          "rgb(95, 191, 145)",
        ]:[ 
          "rgb(255, 99, 132)",
          "rgb(95, 191, 145)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const count_commande_100 = count_rvt_total
    ? Math.round((count_commande / count_rvt_total) * 100)
    : 0;
  const count_livraison_100 = count_rvt_total
    ? Math.round((count_livraison / count_rvt_total) * 100)
    : 0;
  const count_guichet_100 = count_vente_total
    ? Math.round((count_guichet / count_vente_total) * 100)
    : 0;
  const count_caisse_100 = count_vente_total
    ? Math.round((count_caisse / count_vente_total) * 100)
    : 0;
  return (
    <>
      <>
        <div className="row mx-3 ">
          {userConnect.type_utilisateur == "ADMIN" ? (
            <>
              <div className="col-xl-3  col-sm-6">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="media align-items-center">
                      <div className="media-body mr-3">
                        <h2 className="fs-34 text-black font-w600">
                          {count_commande}
                        </h2>
                        <span>Commande (Ravitaillement)</span>
                      </div>
                      <i className="fa fa-clipboard-list fa-3x text-primary"></i>
                    </div>
                  </div>
                  <div className="progress  rounded-0" style={{ height: 4 }}>
                    <div
                      className="progress-bar rounded-0 bg-secondary progress-animated"
                      style={{ width: count_commande_100 + "%", height: 4 }}
                      role="progressbar"
                    >
                      {/* <span className="sr-only">90% Complete</span> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3  col-sm-6">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="media align-items-center">
                      <div className="media-body mr-3">
                        <h2 className="fs-34 font-w600">{count_livraison}</h2>
                        <span>Livraison (Ravitaillement)</span>
                      </div>
                      <i className="fa  fa-shipping-fast fa-3x text-primary"></i>
                    </div>
                  </div>
                  <div className="progress  rounded-0" style={{ height: 4 }}>
                    <div
                      className="progress-bar rounded-0 bg-secondary progress-animated"
                      style={{ width: count_livraison_100 + "%", height: 4 }}
                      role="progressbar"
                    >
                      {/* <span className="sr-only">90% Complete</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
          <div className="col-xl-3 col-sm-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="media align-items-center">
                  <div className="media-body mr-3">
                    <h2 className="fs-34 text-black font-w600">
                      {count_guichet}
                    </h2>
                    <span>Guichet (Vente)</span>
                  </div>
                  <i className="fa fa-list-alt fa-3x text-primary"></i>
                </div>
              </div>
              <div className="progress  rounded-0" style={{ height: 4 }}>
                <div
                  className="progress-bar rounded-0 bg-secondary progress-animated"
                  style={{ width: count_guichet_100 + "%", height: 4 }}
                  role="progressbar"
                >
                  {/* <span className="sr-only">50% Complete</span> */}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3  col-sm-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="media align-items-center">
                  <div className="media-body mr-3">
                    <h2 className="fs-34 text-black font-w600">
                      {count_caisse}
                    </h2>
                    <span>Caisse (Vente)</span>
                  </div>
                  <i className="fa fa-money fa-3x text-primary"></i>
                </div>
              </div>
              <div className="progress  rounded-0" style={{ height: 4 }}>
                <div
                  className="progress-bar rounded-0 bg-secondary progress-animated"
                  style={{ width: count_caisse_100 + "%", height: 4 }}
                  role="progressbar"
                >
                  {/* <span className="sr-only">90% Complete</span> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {userConnect.type_utilisateur == "ADMIN" ? (
        <div className="row mx-3">
          <RuptureStock/>
          <IndicateurPreremption/>
          <TopFiveSoldProduct/>
        </div>
        ):null}

        {/* <div className="card mx-4 mb-3  p-sm-6"> 
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-xl-6  col-sm-12 ">
                {userConnect.type_utilisateur == "ADMIN" ? (
                  <>
                    <div className="d-flex mb-3 align-items-center">
                      <span className="fs-12 col-6 p-0 text-black">
                        <svg
                          className="mr-2"
                          width={19}
                          height={19}
                          viewBox="0 0 19 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width={19} height={19} fill="#5F74BF" />
                        </svg>
                        Commande (Ravitaillement)
                      </span>
                      <div className="progress rounded-0 col-6 p-0">
                        <div
                          className="progress-bar rounded-0 progress-animated"
                          style={{
                            width:
                              (count_commande / count_vente_total) * 100 + "%",
                            height: 6,
                            background: "#5F74BF",
                          }}
                          role="progressbar"
                        >
                          <span className="sr-only">
                            {(count_commande / count_rvt_total) * 100}% Complète
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex mb-3 align-items-center">
                      <span className="fs-12 col-6 p-0 text-black">
                        <svg
                          className="mr-2"
                          width={19}
                          height={19}
                          viewBox="0 0 19 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width={19} height={19} fill="#FFD439" />
                        </svg>
                        Livraison (Ravitaillement)
                      </span>
                      <div className="progress rounded-0 col-6 p-0">
                        <div
                          className="progress-bar rounded-0 progress-animated"
                          style={{
                            width:
                              (count_livraison / count_vente_total) * 100 + "%",
                            height: 6,
                            background: "#FFD439",
                          }}
                          role="progressbar"
                        >
                          <span className="sr-only">
                            {(count_livraison / count_rvt_total) * 100}%
                            Complète
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
                <div className="d-flex mb-3 align-items-center">
                  <span className="fs-12 col-6 p-0 text-black">
                    <svg
                      className="mr-2"
                      width={19}
                      height={19}
                      viewBox="0 0 19 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width={19} height={19} fill="#FF6E5A" />
                    </svg>
                    Guichet (Vente)
                  </span>
                  <div className="progress rounded-0 col-6 p-0">
                    <div
                      className="progress-bar rounded-0 progress-animated"
                      style={{
                        width: (count_guichet / count_vente_total) * 100 + "%",
                        height: 6,
                        background: "#FF6E5A",
                      }}
                      role="progressbar"
                    >
                      <span className="sr-only">
                        {(count_guichet / count_vente_total) * 100}% Complète
                      </span>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span className="fs-12 col-6 p-0 text-black">
                    <svg
                      className="mr-2"
                      width={19}
                      height={19}
                      viewBox="0 0 19 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width={19} height={19} fill="#5FBF91" />
                    </svg>
                    Caisse (Vente)
                  </span>
                  <div className="progress rounded-0 col-6 p-0">
                    <div
                      className="progress-bar rounded-0 progress-animated"
                      style={{
                        width: (count_caisse / count_vente_total) * 100 + "%",
                        height: 6,
                        background: "#5FBF91",
                      }}
                      role="progressbar"
                    >
                      <span className="sr-only">
                        {(count_caisse / count_vente_total) * 100}% Complète
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-6  col-sm-12">
                <div
                  className="col-xl-6  col-sm-12 mx-auto p-4" 
                >
                  <Doughnut
                    data={dataDoughnut}
                    options={{ plugins: { legend: { display: false } } }}
                  />
                </div>
              </div>
            </div> 
          </div>
        </div> */}
      </>
    </>
  );
}

export default StatisticGeneral;
