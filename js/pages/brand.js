import {$, bind} from "../lib/dom.js";
import {createPager} from "../lib/pager.js";
import {state} from "../data/state.js";
import {setLogo, fillVehicles} from "../components/cards.js";

let brand = null, lastId = null;
const pager = createPager($("#brand-pager"), 8, render);

function render(){
  const items = state.vehicles.filter(v => v.brand_id === brand.id);
  fillVehicles($("#b-list"), $("#b-empty"), pager.slice(items), items.length);
}

export function show(id){
  brand = state.brands.find(x => String(x.id) === id);
  $("#b-content").hidden = !brand; $("#b-missing").hidden = !!brand; if(!brand) return "Tidak ditemukan";
  if(id !== lastId){ pager.reset(); lastId = id; }
  bind($("#page-brand"), {name: brand.name, country: "Asal: " + (brand.country || "-"), description: brand.description});
  setLogo($("#b-head .logo"), brand); render();
  return brand.name;
}
