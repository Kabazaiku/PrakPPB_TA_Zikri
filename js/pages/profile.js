import {$} from "../lib/dom.js";
import {toast} from "../lib/dom.js";
import {createPager} from "../lib/pager.js";
import {state, saveFav, saveProfile} from "../data/state.js";
import {fillVehicles} from "../components/cards.js";

const pager = createPager($("#fav-pager"), 6, render);
const favorites = () => state.vehicles.filter(v => state.fav.includes(v.id));

function render(){
  const list = favorites(), p = state.profile;
  $("#p-avatar").textContent = (p.name || "?")[0].toUpperCase();
  $("#p-name").textContent = p.name || "Pengguna"; $("#p-bio").textContent = p.bio || "Belum ada bio";
  $("#pn").value = p.name || ""; $("#pb").value = p.bio || "";
  $("#fav-count").textContent = list.length; $("#clr").hidden = !list.length;
  fillVehicles($("#fav-list"), $("#fav-empty"), pager.slice(list), list.length);
}

export function init(){
  $("#ps").onclick = () => { state.profile = {name: $("#pn").value.trim(), bio: $("#pb").value.trim()}; saveProfile(); toast("Profil disimpan"); render(); };
  $("#clr").onclick = () => { if(confirm("Hapus semua favorit?")){ state.fav = []; saveFav(); render(); } };
}
export const show = render;
