import { atom, RecoilState } from "recoil";

export const isAddState = atom({
  key: "is-add-produit",
  default: { status: true },
});

export const listProduit = atom({
  key: "list-produit",
  default: [],
});

export const listEtalage = atom({
  key: "listEtalage-produit",
  default: [],
});

export const produitSelect = atom({
  key: "produitSelect-produit",
  default: {},
});

export const initialize = {
  code_lot_produit: "",
  nom_produit: "",
  classification_produit: "",
  description: "",
  image: null,
  presentation_quantite: "",
  prix_stock: "",
  date_peremption: "",
  stock_min: "",
  stock_max: "",
  quantite_stock: "",
  // date_der_ravitaillement: "",
  fabricant_id: {
    value: "",
    label: "",
  },
  famille_id: {
    value: "",
    label: "",
  },
  forme_id: {
    value: "",
    label: "",
  },
  voie_id: {
    value: "",
    label: "",
  },
  unite_presentation: {
    value: "",
    label: "",
  },
  unite_achat: {
    value: "",
    label: "",
  },
  unite_vente: {
    value: "",
    label: "",
  },
  unite_stock: {
    value: "",
    label: "",
  },
};
