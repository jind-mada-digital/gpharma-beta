import React from "react";
import Nav from "../../nav";
import FouterNav from "../../nav/FooterNav";
import Table from "./Table";
import Modal from "./Modal";
import View from "./View";
import Activity from "./Activity";
import Body from "../../body";

function Founrisseur() {
  return (
    <Body>
      <div
        className="content-body"
        style={{ minHeight: "90vh", marginTop: "-8vh" }}
      >
        <Table />
        <Modal />
        <View />
        <Activity />
      </div>
    </Body>
  );
}

export default Founrisseur;
