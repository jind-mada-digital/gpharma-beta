import React from "react";
import { useRecoilState } from "recoil";
import { actionEtalage } from "../../../atoms/ravitaillement";
import InsertElatage from "./InsertElatage";
import TableEtalage from "./TableEtalage";

function IndexEtalage() {
  const [actEtalage, setActEtalage] = useRecoilState(actionEtalage);
  return (
    <>
      <div
        className="modal fade"
        id="modalEtalage"
        style={{ display: "none" }}
        aria-modal="true"
        data-backdrop="static"
        data-keyboard="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Etalage</h5>
              <button
                id="closeModalEtalage"
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => {
                  setActEtalage({ status: false });
                }}
              >
                <span>×</span>
              </button>
            </div>
            <div className="modal-body">
              <InsertElatage />
              <TableEtalage />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default IndexEtalage;
