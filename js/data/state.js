import {store, save} from "../lib/storage.js";

/** State aplikasi bersama. Diubah oleh api.js dan halaman. */
export const state = {
  db: null, brands: [], vehicles: [], demo: false, loadError: "",
  fav: store("fav", []),          // id kendaraan favorit (lokal)
  profile: store("profile", {})   // {name, bio} (lokal)
};
export const brandOf = v => state.brands.find(b => b.id === v.brand_id);
export const nameOf = v => `${brandOf(v)?.name ?? ""} ${v.name}`.trim();
export const saveFav = () => save("fav", state.fav);
export const saveProfile = () => save("profile", state.profile);
