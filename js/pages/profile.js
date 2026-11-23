import {$, toast} from "../lib/dom.js";
import {state, saveProfile} from "../data/state.js";

function render(){
  const p = state.profile;
  $("#p-avatar").textContent = (p.name || "?")[0].toUpperCase();
  $("#p-name").textContent = p.name || "Pengguna"; $("#p-bio").textContent = p.bio || "Belum ada bio";
  $("#pn").value = p.name || ""; $("#pb").value = p.bio || "";
  $("#p-fav-count").textContent = state.vehicles.filter(v => state.fav.includes(v.id)).length;
}

export function init(){
  $("#ps").onclick = () => { state.profile = {name: $("#pn").value.trim(), bio: $("#pb").value.trim()}; saveProfile(); toast("Profil disimpan"); render(); };
}
export const show = render;
