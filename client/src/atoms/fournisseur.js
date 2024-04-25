import { atom, RecoilState } from "recoil";

export const isAddState = atom({
  key: "is-add-fournisseur",
  default: { status: true },
});

export const listFournisseur = atom({
  key: "list-fournisseur",
  default: [],
});

export const fournisseurSelect = atom({
  key: "select-fournisseur",
  default: {},
});

export const initialize = {
  nom_fournisseur: "",
  contact_fournisseur: "",
  contact_secretaire: "",
  compte_PCG: "",
  logo: "",
  condition_paiement: "",
  delais_reglement: "",
  email: "",
  adresse: "",
  nif: "",
  stat: "",
  sigle: "",
};
