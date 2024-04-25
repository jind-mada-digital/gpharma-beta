
import React from "react"; 
import Body from "../../body"; 
import Edit from "./Edit";

function Pharmacie() {
  return (
    <Body>
      <div
        className="content-body"
        style={{ minHeight: "60vh", marginTop: "-8vh" }}
      >
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <Edit />
            </div>
          </div>
        </div>
      </div>
    </Body>
  );
}

export default Pharmacie;
