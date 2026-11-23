import {$} from "../lib/dom.js";
import {createPager} from "../lib/pager.js";
import {state, saveFav} from "../data/state.js";
import {fillVehicles} from "../components/cards.js";

const pager = createPager($("#fav-pager"), 8, render);

function render(){
  const list = state.vehicles.filter(v => state.fav.includes(v.id));
  $("#fav-count").textContent = list.length; $("#clr").hidden = !list.length;
  fillVehicles($("#fav-list"), $("#fav-empty"), pager.slice(list), list.length);
}

export function init(){
  $("#clr").onclick = () => { if(confirm("Hapus semua favorit?")){ state.fav = []; saveFav(); pager.reset(); render(); } };
}
export const show = render;
