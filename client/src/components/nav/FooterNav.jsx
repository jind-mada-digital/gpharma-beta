import React from "react";

function FooterNav({...props}) {
  return (
    <>
      <div className="footer"{...props}>
        <div className="copyright">
          <p>
            Copyright © Développé par{" "}
            <a href="https://www.mada-digital.net/" target="_blank">
              MADA-Digital
            </a>
            {"  "}
            2022
          </p>
        </div>
      </div>
    </>
  );
}

export default FooterNav;
