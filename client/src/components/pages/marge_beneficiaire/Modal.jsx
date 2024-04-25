import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  addData,
  getData,
  getUrl,
  InputForm,
  updateData,
  onChange,
} from "../../../utils/utils";
import {
  isAddState,
  listMarge_beneficiaire,
  marge_beneficiaireSelect,
  initialize,
} from "../../../atoms/marge_beneficiaire";
import { text } from "@fortawesome/fontawesome-svg-core";
import { toast } from "react-toastify";

function Modal() {
  const [isAdd, setIsAdd] = useRecoilState(isAddState);
  const [list, setList] = useRecoilState(listMarge_beneficiaire);
  const [marge_beneficiaireSelected, setMarge_beneficiaireSelected] =
    useRecoilState(marge_beneficiaireSelect);
  const [marge_beneficiaire, setMarge_beneficiaire] = useState("");
  const [isOb, setIsOb] = React.useState(false);

  const getAll = () => {
    setIsOb(false);
    setMarge_beneficiaire(initialize);
    document.getElementById("closeModalmarge_beneficiaire").click();
    getData("marge_beneficiaire", (data) => {
      setIsAdd({ status: true });
      setList(data);
    });
  };

  const add = () => {
    if (!marge_beneficiaire) {
      return;
    }
    addData("marge_beneficiaire", { data: { marge_beneficiaire } }, getAll);
  };
  const update = () => {
    if (!marge_beneficiaire) {
      return;
    }
    updateData(
      "marge_beneficiaire",
      marge_beneficiaireSelected.id,
      { data: {marge_beneficiaire} },
      getAll
    );
  };
  useEffect(() => {
    if (isAdd.status) {
      setMarge_beneficiaire("");
    } else {
      if (marge_beneficiaireSelected) {
        setMarge_beneficiaire(marge_beneficiaireSelected.marge_beneficiaire);
      }
    }
  }, [isAdd]);
  useEffect(() => {
    if (marge_beneficiaireSelected) {
      setMarge_beneficiaire(marge_beneficiaireSelected.marge_beneficiaire);
    }
  }, [marge_beneficiaireSelect]);
  return (
    <div
      className="modal fade"
      id="modalmarge_beneficiaire"
      style={{ display: "none" }}
      aria-modal="true"
      data-backdrop="static"
      data-keyboard="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isAdd.status ? "Ajouter" : "Modifier"} un marge bénéficiaire
            </h5>
            <button
              type="button"
              id="closeModalmarge_beneficiaire"
              className="close"
              data-dismiss="modal"
              onClick={() => {
                setIsOb(false);
                setMarge_beneficiaire("");
              }}
            >
              <span>×</span>
            </button>
          </div>
          <div className="modal-body">
            <InputForm
              val={marge_beneficiaire}
              onChange={(e) => setMarge_beneficiaire(e.target.value)}
              obligatory={isOb ? "active" : ""}
            >
              Marge bénéficiaire (ex : 1.5 / 50% de bénéfice)
            </InputForm>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger light"
              data-dismiss="modal"
              onClick={() => {
                setIsOb(false);
                setMarge_beneficiaire("");
              }}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setIsOb(true);
                isAdd.status ? add() : update();
              }}
            >
              {isAdd.status ? "Ajouter" : "Modifier"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
