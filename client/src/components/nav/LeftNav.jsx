import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function LeftNav({children}) {
  return (
    <>
      <div className="deznav"  >
        <div className="deznav-scroll ps ps--active-y">
          <ul className="metismenu" id="menu">
            {children} 
          </ul>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default LeftNav;
