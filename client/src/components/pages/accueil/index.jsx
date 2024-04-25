import React from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userConnected } from "../../../atoms/authentication";
import {
  filterOption,
  InputForm,
  onChange,
  SelectForm,
} from "../../../utils/utils";
import Body from "../../body";
import Nav from "../../nav";
import FooterNav from "../../nav/FooterNav";
import StatisticGeneral from "./StatisticGeneral";
import StatisticPersonnel from "./StatisticPersonnel";
import StatisticStock from "./StatisticStock";
import StatisticVente from "./StatisticVente";


function Accueil() {
  const [userConnect, setUserConnect] = useRecoilState(userConnected);
  const [Options, setOptions] = React.useState([
    {
      label: "Stat. Journalière",
      value: "0",
    },
    {
      label: "Stat. Hébdomadaire",
      value: "1",
    },
    {
      label: "Stat. Mensuelle",
      value: "2",
    },
  ]);
  const [choose_option, setChoose_option] = React.useState();
  const [date_selected, setDate_selected] = React.useState(
    new Date().getFullYear() +
      "-" +
      (parseInt(parseInt(new Date().getUTCMonth()) + 1).toString().length == 2
        ? parseInt(parseInt(new Date().getUTCMonth()) + 1)
        : "0" + parseInt(parseInt(new Date().getUTCMonth()) + 1)) +
      "-" +
      new Date().getUTCDate()
  );
  return (
    <Body> 
      <div
        className="content-body"
        style={{ minHeight: "80vh", marginTop: "-7vh" }}
      >
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <div className="row  align-items-center">
                <div className="col w-100" style={{ marginTop: "2vh"}}>
                  <p className="text-justify">
                  Bienvenue sur <b>Gpharma</b>. Chez vous, en déplacement, depuis votre tablette, smartphone ou ordinateur personnel, votre officine reste toujours accessible et connectée. Vérifiez l’état de vos stocks, suivez l’évolution de vos ventes, communiquez avec vos collaborateurs, surveillez que tout se passe bien. 
                  </p>
                </div>
                <div className="col-3">
                  <div className="text-center">
                    <img
                      src="./images/logo.png"
                      style={{
                        width: "70%",
                        marginTop: "-3vh",
                        marginBottom: "-3vh",
                      }}
                      alt="logo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-head d-flex align-items-center mb-sm-4 mb-3 ml-5">
          <div className="mr-auto">
            <h2 className="text-black font-w600">Infos</h2>
            <p className="mb-0">Générale</p>
          </div>
        </div>
        <StatisticGeneral />
        {userConnect.type_utilisateur == "ADMIN" ? (
          <>
            <div className="form-head d-flex align-items-center mb-sm-4 mt-6 mb-3 ml-5">
              <div className="mr-auto">
                <h2 className="text-black font-w600">Statistique</h2>
                {/* <p class="mb-0">Générale</p> */}
              </div>
            </div>
            <div className=" m-4 mb-sm-4 mb-3 ">
              <div className="card">
                <div className="card-header d-sm-flex d-block pb-0 border-0">
                  <div className="mr-auto pr-3">
                    <div className="row">
                      <div className="">
                        <SelectForm
                          defaultValue={Options[0]}
                          value={filterOption(Options, choose_option)}
                          options={Options}
                          onChange={setChoose_option}
                        ></SelectForm>
                      </div>
                      <div className="ml-4">
                        <input
                          type="date"
                          style={{ height: "41px" }}
                          value={date_selected}
                          onChange={(e) => { 
                            setDate_selected(e.target.value);
                          }}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-action card-tabs mt-3 mt-sm-0 mt-3 mb-sm-0 mb-3 mt-sm-0">
                    <ul className="nav nav-tabs" role="tablist">
                      <li className="nav-item">
                        <a
                          className="nav-link active"
                          data-toggle="tab"
                          href="#vente"
                          role="tab"
                          aria-selected="true"
                        >
                          Vente
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          data-toggle="tab"
                          href="#stock"
                          role="tab"
                          aria-selected="false"
                        >
                          Stock
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          data-toggle="tab"
                          href="#personnel"
                          role="tab"
                          aria-selected="false"
                        >
                          Personnel
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body">
                  <div className="tab-content">
                    <div
                      className="tab-pane fade active show"
                      id="vente"
                      role="tabpanel"
                    >
                      <StatisticVente
                        choose_option={choose_option}
                        date_selected={date_selected}
                      />
                    </div>
                    <div className="tab-pane fade" id="stock" role="tabpanel">
                      <StatisticStock
                        choose_option={choose_option}
                        date_selected={date_selected}
                      />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="personnel"
                      role="tabpanel"
                    >
                      <StatisticPersonnel
                        choose_option={choose_option}
                        date_selected={date_selected}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Body>
  );
}

export default Accueil;
