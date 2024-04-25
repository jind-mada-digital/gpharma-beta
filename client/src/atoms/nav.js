import { atom } from "recoil";

export const showRightNav = atom({
  key: "showRightNav-nav",
  default: 0,
});

export const showNotifNav = atom({
  key: "showNotifNav-nav",
  default: 0,
});

export const ClassShowMenuState = atom({
  key: "ClassShowMenu-nav",
  default: { status: false },
});
