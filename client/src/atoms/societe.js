import { atom } from "recoil";

export const isAddState = atom({
  key: "isAdd-societe",
  default: {status : true},
});

export const listSociete = atom({
  key: "list-societe",
  default: [],
});

export const societeSelect = atom({
  key: "societeSelect-societe",
  default: {},
});

export const initialize ={
    nom_societe: "",
    prise_en_charge: "",
}
