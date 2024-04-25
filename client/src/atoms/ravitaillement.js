import { atom } from "recoil";

export const toggleAddTableEdit = atom({
  key: "is-add-ravitaillement",
  default: 0, //0:Table , 1:Add, 2:Edit
});
export const actionEtalage = atom({
  key: "actionEtalage-ravitaillement",
  default: { status: false }, //0:Table , 1:Add, 2:Edit
});
export const ravitaillementSelect = atom({
  key: "idRavitaillementSelect-ravitaillement",
  default: { id: "", etat_ravitaillement: "" }, //0:Table , 1:Add, 2:Edit
});

export const listRavitaillement = atom({
  key: "list-ravitaillement",
  default: [],
});

export const intializeRavitaillement = {
  motif: "",
  montant_ht: "",
  etat_ravitaillement: "EN_COURS",
  date_prev_livraison: "",
  tva: "20",
  caisse_id: {
    label: "",
    value: "",
  },
  fournisseur_id: {
    label: "",
    value: "",
  },
  mode_expedition_id: {
    label: "",
    value: "",
  },
};

export const intializeRavitaillementDetails = {
  prix_unit: "",
  prix_ht: "",
  nom_produit: "",
  quantite_demande: "",
  montant_ht: "",
  produit_code_lot_produit: {
    label: "",
    value: "",
  },
  unite_achat: "",
};
