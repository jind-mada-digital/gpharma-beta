import { atom } from "recoil";

export const isAddState = atom({
  key: "isAddState-guichet",
  default: "1",
});
export const listGuichet = atom({
  key: "list-guichet",
  default: [],
});
export const guichetSelect = atom({
  key: "guichetSelect-guichet",
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

export const intializeGuichetSelected = [
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
export const intializeClient = {
  nom_prenom: "",
  adresse: "",
  societe_id: {
    label: "",
    value: "",
  },
};
export const intializeOrdonnance = {
  nom_docteur: "",
  hopital: "",
};
export const intializeVente = {
  motif: "",
  montant_total: "",
  date_saisi: "",
  guichet_id: {
    label: "",
    value: "",
  },
  date_vente: null,
  etat_vente: "0",
  file_societe: "",
  societe_prise_en_charge: "1",
};
export const intializeVenteDetails = {
  quantite_demande: "",
  prix_vente: "000.00",
  unite_vente: "",
  montant_vente: "000.00",
  produit_code_lot_produit: {
    label: "",
    value: "",
  },
};
