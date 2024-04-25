import React from "react";
import Body from "../../body"; 
import Modal from "./Modal";
import Table from "./Table"

function Marge_beneficiaire() {
  return ( 
      <Body>
        
      <div className="content-body" style={{ minHeight: "80vh", marginTop:"-12vh" }}>
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <Modal/>
              <Table/>
            </div>
          </div>
        </div>
      </div>
      </Body> 
  );
}

export default Marge_beneficiaire;
