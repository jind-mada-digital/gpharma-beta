import React from "react";
import { useRecoilState } from "recoil"; 
import { isAddState } from "../../../atoms/caisse";
import Insert from "./Insert";
import Table from "./Table";
import View from "./View";
import Body from "../../body";

function Caisse() { 
  const [isAdd, setIsAdd] = useRecoilState(isAddState)
  return (
    <Body>
      <div
        className="content-body"
        style={{ minHeight: "80vh", marginTop: "-10vh" }}
        >
        <div className="container-fluid">
        <h2 className="my-4">Vente / Caisse</h2>
          {isAdd === "1" ? <Insert /> :<> <Table /> <View/></>}
        </div>
      </div>
    </Body>
  );
}

export default Caisse;
