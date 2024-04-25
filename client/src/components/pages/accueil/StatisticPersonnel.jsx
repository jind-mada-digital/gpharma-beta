import React, { useEffect, useState } from "react";
import { PolarArea } from "react-chartjs-2";
import { Chart, ArcElement, registerables } from "chart.js";
import {
  convertToOption,
  filterOption,
  getData,
  SelectForm,
  urlRead,
} from "../../../utils/utils";
import axios from "axios";
import { userConnected } from "../../../atoms/authentication";
import { useRecoilState } from "recoil";

Chart.register(...registerables);
Chart.register(ArcElement);

function StatisticPersonnel({ choose_option, date_selected }) {
  const [Options, setOptions] = React.useState([]);
  const [userConnect, setUserConnect] = useRecoilState(userConnected);
  const [utilisateur, setUtilisateur] = React.useState({});
  const [StatPersonnel1, setStatPersonnel1] = useState({});
  const [StatPersonnel2, setStatPersonnel2] = useState([]);
  const data = {
    labels: [
      "Commande (Ravitaillement)",
      "Livraison (Ravitaillement)",
      "Guichet (Vente)",
      "Caisse (Vente)",
    ],
    datasets: [
      {
        label: utilisateur?.nom_utilisateur ?? "Tous les personnels",
        data: StatPersonnel2,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(255, 205, 86)",
          "rgb(54, 162, 235)",
        ],
      },
    ],
  };

  const getStatPersonnel = async () => {
    if (userConnect.type_utilisateur == "ADMIN") {
      let data = await axios.get(
        urlRead(
          "accueil/StatPersonnel/" +
            (choose_option?.value ?? 0) +
            "/" +
            date_selected +
            "/" +
            utilisateur.value || userConnect.id || 1
        )
      );
      data = [data.data[0][0], data.data[1][0]];
      setStatPersonnel1({
        ["count_admin"]: data[0].count_admin,
        ["count_guichetier"]: data[0].count_guichetier,
        ["count_caissier"]: data[0].count_caissier,
      });
      setStatPersonnel2([
        data[1].count_commande,
        data[1].count_livraison,
        data[1].count_guichet,
        data[1].count_caisse,
      ]);
    }
  };
  const getOptionsUsers = async () => {
    const data = await axios.get(
      urlRead("utilisateurs/"+ utilisateur.value || userConnect.id || 1)
    );   
    console.log("utilisateur userConnect", utilisateur, userConnect);
    convertToOption(data.data, setOptions); 
  };
  useEffect(() => { 
    getOptionsUsers()
  }, []);
  useEffect(() => {
    getStatPersonnel();
  }, [utilisateur]);
  return (
    <div className="m-xl-3 p-xl-3 m-sm-0 p-sm-0">
      <div className="row items-align-center">
        <div className="col-xl-5 col-sm-12 w-100">
          <div className="w-100">
            <div className="p-3 ">
              <label htmlFor="" className="font-w600 mb-6">
                Les personnels
              </label>
              <SelectForm
                defaultValue={{
                  label: "Choisissez un personnel pour voir ses stats",
                  value: "0"
                }}
                value={filterOption(Options, utilisateur)}
                options={Options}
                onChange={setUtilisateur}
              ></SelectForm>
            </div>
          </div>
          <div className="w-100">
            <div className="card p-3 m-3 shadow-sm">
              <div className="d-flex justify-content-between items-align-center px-4">
                <div>
                  <h2 className="fs-32 font-w600">
                    {StatPersonnel1?.count_admin ?? 0}
                  </h2>
                  <span>Adminitrateur</span>
                </div>
                <i className="fa fa-user-cog fa-3x text-primary"></i>
              </div>
            </div>
          </div>
          <div className="w-100">
            <div className="card p-3 m-3 shadow-sm">
              <div className="d-flex justify-content-between items-align-center px-4">
                <div>
                  <h2 className="fs-32 font-w600">
                    {StatPersonnel1?.count_caissier ?? 0}
                  </h2>
                  <span>Caissier</span>
                </div>
                <i className="fa fa-user-check  fa-3x text-primary"></i>
              </div>
            </div>
          </div>
          <div className="w-100">
            <div className="card p-3 m-3 shadow-sm">
              <div className="d-flex justify-content-between items-align-center px-4">
                <div>
                  <h2 className="fs-32 font-w600">
                    {StatPersonnel1?.count_guichetier ?? 0}
                  </h2>
                  <span>Guichetier</span>
                </div>
                <i className="fa fa-user-edit fa-3x text-primary"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-7 col-sm-12 ">
          <div className="col  ml-xl-4 mb-lg-0 mb-3">
            <div className="d-flex align-items-center justify-content-center">
              <PolarArea 
                data={data}
                options={{ plugins: { legend: { position: "bottom"} } }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticPersonnel;
