import React from "react";
import { useRecoilState } from "recoil";
import { ClassShowMenuState } from "../../atoms/nav";
import Nav from "../nav";
import FooterNav from "../nav/FooterNav";

function Body({ children }) {
  const [ClassShowMenu, setClassShowMenu] = useRecoilState(ClassShowMenuState);
  return (
    <>
      <div
        id="main-wrapper"
        className={ClassShowMenu.status ? "show menu-toggle" : "show"}
      >
        <Nav />
        {children}
        <FooterNav />
      </div>
    </>
  );
}

export default Body;
