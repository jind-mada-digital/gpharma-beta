import { atom } from "recoil";

export const isAddState = atom({
  key: "isAddState-caisse",
  default: "1",
});

export const venteSelect = atom({
  key: "venteSelect-caisse",
  default: [
    {
      id: "",
      motif: "",
      date_saisi: "",
      date_vente: "",
      client: "",
      etat_vente: "",
      ordonnance: "",
      societe: "",
      file_societe: "",
      societe_prise_en_charge: "",
      caisse: "",
      guichet: "",
      caissier: "",
      guichetier: "",
    },
    [],
  ],
});

export const intializeVenteSelected = [
  {
    id: "",
    motif: "",
    date_saisi: "",
    date_vente: "",
    client: "",
    etat_vente: "",
    ordonnance: "",
    societe: "",
    file_societe: "",
    societe_prise_en_charge: "",
    caisse: "",
    guichet: "",
    caissier: "",
    guichetier: "",
  },
  [],
];
