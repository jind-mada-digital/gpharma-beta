import React from "react";
import Nav from "../../nav";
import FooterNav from "../../nav/FooterNav";
import { useRecoilState } from "recoil";
import Insert from "./Insert";
import Table from "./Table";
import { isAddState } from "../../../atoms/guichet";
import View from "./View";
import Body from "../../body";

function Guichet() {
  const [isAdd, setIsAdd] = useRecoilState(isAddState);
  return (
    <Body>
      <div
        className="content-body"
        style={{ minHeight: "80vh", marginTop: "-10vh" }}
      >
        <div className="container-fluid">
        <h2 className="my-4">Vente / Guichet</h2>
          <div className="card">
            <div className="card-body">
              {isAdd == "1" ? (
                <Insert />
              ) : (
                <>
                  <Table />
                  <View />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Body>
  );
}

export default Guichet;
