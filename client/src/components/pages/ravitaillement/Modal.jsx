import React from "react";
import { useRecoilState } from "recoil";
import {
  ravitaillementSelect,
  toggleAddTableEdit,
} from "../../../atoms/ravitaillement";
import {
  convertToOption,
  filterOption,
  getData,
  InputForm,
  SelectForm,
  updateData,
} from "../../../utils/utils";

function Modal({ ravitaillement, listRavitaillementDetails }) {
  const [isOb, setIsOb] = React.useState(false);
  const [toggle, setToggle] = useRecoilState(toggleAddTableEdit);
  const [caisseSelected, setCaisseSelected] = React.useState({});
  const [OptionsCaisse, setOptionsCaisse] = React.useState([]);
  const [date_livraison, setDate_livraison] = React.useState("");
  const [rvtSelect, setRvtSelect] = useRecoilState(ravitaillementSelect);

  React.useEffect(() => {
    getData("caisse", (data) => convertToOption(data, setOptionsCaisse));
  }, []);

  const valider = () => {
    setIsOb(true);
    if (!caisseSelected.value || !date_livraison) {
      return;
    }
    const getTotalsHT = () => {
      if (listRavitaillementDetails.length > 0) {
        let total = 0;
        listRavitaillementDetails.forEach((item) => {
          total += item.quantite_livraison * item.prix_unit;
        });
        return total;
      }
    };
  
    updateData(
      "validate_ravitaillement",
      rvtSelect.id,
      {
        caisse_id: caisseSelected.value,
        montant_ht: getTotalsHT(),
        date_livraison,
        ravitaillement,
        listRavitaillementDetails,
      },
      () => {
        setIsOb(false);
        document.getElementById("close-modal-valider").click()
        setToggle(0);
      }
    );
  };

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "none", paddingBottom: "15vh" }}
        aria-modal="true"
        data-backdrop="static"
        data-keyboard="true"
        id="modalEdit"
      >
        <div className="modal-dialog  modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Validation</h5>
              <button type="button" className="close" id="close-modal-valider" data-dismiss="modal">
                <span>×</span>
              </button>
            </div>
            <div className="modal-body">
              <InputForm
                date
                val={date_livraison}
                min={rvtSelect.date_prev_livraison}
                onChange={(e)=>setDate_livraison(e.target.value)}
                obligatory={isOb ? "active" : ""}
              >
                Date de livraison
              </InputForm>
              <SelectForm
                val={caisseSelected}
                value={filterOption(OptionsCaisse, caisseSelected)}
                onChange={(e) => setCaisseSelected(e)}
                options={OptionsCaisse}
                obligatory={isOb ? "active" : ""}
              >
                Caisse utilisé
              </SelectForm>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger light"
                data-dismiss="modal"
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={valider}
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
