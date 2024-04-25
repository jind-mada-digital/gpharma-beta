import { atom } from "recoil";

export const isAddState = atom({
  key: "isAddState-ajsutement",
  default: "0",
});
export const listAjustement = atom({
  key: "lise-ajsutement",
  default: [],
});

export const ajustementSelect = atom({
  key: "ajustementSelect-ajsutement",
  default: {},
});
