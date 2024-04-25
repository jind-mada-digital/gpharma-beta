import React, { useState } from "react";
import { useEffect } from "react";
import { getData, getClassByNumber } from "../../../utils/utils";
import Nav from "../../nav";
import FooterNav from "../../nav/FooterNav";
import Table from "./Table";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { countArr, table_name } from "../../../atoms/parametre";
import {
  faBox,
  faBuilding,
  faCashRegister,
  faDonate,
  faDownload,
  faHammer,
  faList,
  faRecycle,
  faRoute,
  faRuler,
  faSave,
  faUsers,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import Body from "../../body";

const ItemParametre = ({ array, table, icon, children }) => {
  const [tb_name, setTb_name] = useRecoilState(table_name);
  const [number, setNumber] = useState(0);
 
  useEffect(() => {
    if (array.length > 0) {
      setNumber(array[0]["count_" + table]);
    }
  }, [array]);
  return (
    <>
      <a
        type="button"
        className={
          table == tb_name
            ? "list-group-item text-" + getClassByNumber(number)
            : "list-group-item"
        }
        onClick={() => setTb_name(table)}
      >
        <FontAwesomeIcon
          icon={icon}
          className={"font-18 align-middle mr-2 text" + getClassByNumber(number)}
        />
         {children}
        <span
          className={`badge badge-${getClassByNumber(
            number
          )} badge-sm text-white float-right`}
        >
          {number}
        </span>
      </a>
    </>
  );
};

function Parametre() {
  const [countArray, setCountArray] = useRecoilState(countArr);

  useEffect(() => {
    getData("parametre/count", setCountArray);
  }, []);

  return (
    <Body> 
      
      <div
        className="content-body"
        style={{ minHeight: "90vh", marginTop: "-8vh" }}
      >
        <div className="card-body">
          <div className="email-left-box generic-width px-0 mb-5">
            <div className="mail-list mt-4">
              <a className="list-group-item active">
                <i className="fa fa-inbox font-18 align-middle mr-2" />{" "}
                Paramètres
                <span className="badge badge-primary badge-sm float-right">
                  8
                </span>
              </a>
              <ItemParametre
                icon={faCashRegister}
                array={countArray}
                table="caisse"
              >
                Caisse
              </ItemParametre>
              {/* <ItemParametre
                icon={faWarehouse}
                array={countArray}
                table="emplacement"
              >
                Emplacement
              </ItemParametre> */}
              <ItemParametre
                icon={faHammer}
                array={countArray}
                table="fabricant"
              >
                Fabricant
              </ItemParametre>
              <ItemParametre icon={faUsers} array={countArray} table="famille">
                Famille
              </ItemParametre>
              <ItemParametre icon={faBox} array={countArray} table="forme">
                Forme
              </ItemParametre>
              <ItemParametre icon={faDonate} array={countArray} table="guichet">
                Guichet
              </ItemParametre>
              <ItemParametre
                icon={faRoute}
                array={countArray}
                table="mode_expedition"
              >
                Mode d'expédition
              </ItemParametre>
              <ItemParametre icon={faRuler} array={countArray} table="unite">
                Unité
              </ItemParametre>
              {/* <ItemParametre icon={faBuilding} array={countArray} table="societe">Société</ItemParametre> */}
              <ItemParametre icon={faRecycle} array={countArray} table="voie">
                Voie
              </ItemParametre>


              {/* Section suplementaire pour savegarde et l'import export */}
              <ItemParametre icon={faDownload} array={countArray} table="importExport">
              Import et Export
              </ItemParametre>
              <ItemParametre icon={faSave} array={countArray} table="save">
              Sauvegarde et Restauration
              </ItemParametre>


            </div>
          </div>
          <div className="email-right-box ml-0 ml-sm-4 ml-sm-0">
            <Table />
          </div>
        </div>
      </div>
    </Body>
  );
}

export default Parametre;
