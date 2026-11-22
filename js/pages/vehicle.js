import {$, clone, bind, toast} from "../lib/dom.js";
import {rp} from "../lib/format.js";
import {state, brandOf, nameOf, saveFav} from "../data/state.js";
import {setImage, setLogo} from "../components/cards.js";

let current = null;

function setFav(){
  const on = !!current && state.fav.includes(current.id), b = $("#v-fav");
  b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); $("i", b).className = "bi bi-heart" + (on ? "-fill" : "");
}

export function init(){
  $("#v-fav").onclick = () => {
    if(!current) return;
    const on = state.fav.includes(current.id);
    state.fav = on ? state.fav.filter(x => x !== current.id) : [...state.fav, current.id]; saveFav();
    toast(on ? "Dihapus dari favorit" : "Ditambah ke favorit"); setFav();
  };
}

export function show(id){
  const v = state.vehicles.find(x => String(x.id) === id); current = v || null;
  $("#v-content").hidden = !v; $("#v-missing").hidden = !!v; if(!v) return "Tidak ditemukan";
  const b = brandOf(v);
  bind($("#page-vehicle"), {title: nameOf(v), category: v.category, type: v.type, price: rp(v.price), description: v.description, bname: b?.name, bcountry: b?.country});
  setImage($("#v-hero"), v);
  const specs = Object.entries(v.specs || {});
  $("#v-specs").replaceChildren(...specs.map(([k, val]) => { const e = clone("tpl-spec"); bind(e, {k, v: val}); return e; }));
  $("#v-specs").hidden = !specs.length;
  $("#v-brand").href = b ? "#/brand/" + b.id : "#/brands"; setLogo($("#v-brand .logo"), b);
  setFav();
  return v.name;
}
