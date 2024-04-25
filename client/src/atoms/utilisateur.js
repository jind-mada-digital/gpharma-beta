import { atom } from "recoil";

export const isAddState = atom({
  key: "is-add-utilisateur",
  default: true,
});

export const previewImage = atom({
  key: "preview-image-utilisateur",
  default: "images/profile/1.jpg",
});
export const initializeState = atom({
  key: "initialize-utilisateur",
  default: {
    nom_utilisateur: "",
    nom_login: "",
    sexe: [],
    type_utilisateur: [],
    contact: "",
    email: "",
    mot_de_passe: "",
    image: null,
  },
});

export const listUtilisateurState = atom({
  key: "list-utilisateur",
  default: [],
});

export const userSelectState = atom({
  key: "user-select-utilisateur",
  default: [],
});
