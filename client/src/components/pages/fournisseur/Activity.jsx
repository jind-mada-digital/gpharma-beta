import React from "react"; 
import TableActivity from "./TableActivity";

function Activity({ id }) { 
  return (
    <>
      <div
        className="modal fade"
        id="modalActivityFournisseur"
        style={{ display: "none" }}
        aria-modal="true"
        data-backdrop="static"
        data-keyboard="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Activités des fournisseurs
              </h5>
              <button
                // ref={closeRef}
                id="closeModalActivity"
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => {}}
              >
                <span>×</span>
              </button>
            </div>
            <div className="modal-body">
                <TableActivity/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Activity;
