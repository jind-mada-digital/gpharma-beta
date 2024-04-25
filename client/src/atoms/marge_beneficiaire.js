import { atom } from "recoil";

export const isAddState = atom({
  key: "isAdd-marge_beneficiaire",
  default: { status: true },
});

export const listMarge_beneficiaire = atom({
  key: "list-marge_beneficiaire",
  default: [],
});

export const marge_beneficiaireSelect = atom({
  key: "marge_beneficiaireSelect-marge_beneficiaire",
  default: {},
});

export const initialize = {
  marge_beneficiaire: "",
};
