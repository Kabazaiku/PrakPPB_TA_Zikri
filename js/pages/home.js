import {$, $$} from "../lib/dom.js";
import {createPager} from "../lib/pager.js";
import {state, nameOf} from "../data/state.js";
import {fillVehicles} from "../components/cards.js";

const filter = {q: "", cat: "Semua"};
const pager = createPager($("#home-pager"), 8, render);

function render(){
  const q = filter.q.toLowerCase();
  const items = state.vehicles.filter(v => (filter.cat === "Semua" || v.category === filter.cat) && nameOf(v).toLowerCase().includes(q));
  fillVehicles($("#vehicle-list"), $("#home-empty"), pager.slice(items), items.length);
}

export function init(){
  $("#q").oninput = e => { filter.q = e.target.value; pager.reset(); render(); };
  $$(".chip").forEach(c => c.onclick = () => {
    filter.cat = c.dataset.cat; pager.reset();
    $$(".chip").forEach(x => { x.classList.toggle("on", x === c); x.setAttribute("aria-pressed", x === c); });
    render();
  });
}
export function show(){
  $("#demo-note").hidden = !state.demo;
  $("#demo-note-text").textContent = state.loadError
    ? `Gagal memuat dari Supabase (${state.loadError}). Menampilkan data demo.`
    : "Mode demo: .env belum diisi atau belum terbaca. Jalankan ulang npm start setelah mengisinya.";
  $("#stat-vehicles").textContent = state.vehicles.length;
  $("#stat-brands").textContent = state.brands.length;
  render();
}
