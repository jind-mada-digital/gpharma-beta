import React from "react";
import { useRecoilState } from "recoil";
import Nav from "../../nav";
import FooterNav from "../../nav/FooterNav";
import Modal from "./Modal";
import Viewer from "./Viewer";
import Table from "./Table";
import {
  isAddState,
  listUtilisateurState,
  userSelectState,
} from "../../../atoms/utilisateur";
import { confirmDelete, deleteData, getData } from "../../../utils/utils";
import { userConnected } from "../../../atoms/authentication";
import Body from "../../body";

function Utilisateur() {
  const [listUser, setListUser] = useRecoilState(listUtilisateurState);
  const [isAdd, setIsAdd] = useRecoilState(isAddState);
  const [userSelect, setUserSelect] = useRecoilState(userSelectState);
  const [userConnect, setUserConnect] = useRecoilState(userConnected);

  const showModalUpdateUser = (id) => {
    getData(
      "utilisateur",
      (user) => {
        setUserSelect({...user, mot_de_passe: ""}); 
      },
      id
    );
  };
  const deleteUser = (id) => {
    confirmDelete("Voulez-vous vraimment supprimé cet utilisateur?", () => {
      deleteData("utilisateur", id, () => {
        console.log("delete ", id, "lancement du mise à jours de la liste");
        getData("utilisateurs", setListUser, userConnect.id);
      });
    });
  };
  const viewUser = (id) => {
    console.log(id);
    getData(`utilisateur`, setUserSelect, id);
  };
  return (
    <Body> 
      <div
        className="content-body"
        style={{ minHeight: "90vh", marginTop: "-3vh" }}
      >
        <div className="container-fluid">
          {/* <div className="page-titles" style={{ marginBottom: "0vh" }}>
            <h4>Gestion des utilisateurs</h4>
          </div> */} 
          <Table
            isAdd={setIsAdd}
            update={showModalUpdateUser}
            del={deleteUser}
            view={viewUser}
            list={listUser}
          />
          {/* <Viewer data={dataView} /> */}
        </div>
      </div>
      <Modal />
      <Viewer data={userSelect} /> 
    </Body>
  );
}

export default Utilisateur;
