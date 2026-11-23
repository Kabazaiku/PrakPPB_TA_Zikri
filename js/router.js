// Router berbasis hash (#/vehicle/3). Tiap halaman mengekspor init() (sekali) dan show(id) (tiap dibuka).
import {$, $$} from "./lib/dom.js";
import * as home from "./pages/home.js";
import * as brands from "./pages/brands.js";
import * as vehicle from "./pages/vehicle.js";
import * as brand from "./pages/brand.js";
import * as add from "./pages/add.js";
import * as profile from "./pages/profile.js";
import * as about from "./pages/about.js";
import * as favorites from "./pages/favorites.js";
import {state} from "./data/state.js";

// nav = item bottom nav yang disorot, back = tombol kembali, section = id halaman jika berbeda dari kunci rute,
// fn = fungsi halaman yang dipanggil (default "show")
const ROUTES = {
  home:    {page: home,    title: "Wheelie",           nav: "home"},
  brands:  {page: brands,  title: "Merek",             nav: "brands"},
  add:     {page: add,     title: "Tambah Kendaraan",  nav: "home",   back: true},
  favorites:{page: favorites,title: "Favorit Saya",   nav: "favorites"},
  edit:    {page: add,     title: "Edit Kendaraan",    nav: "home",   back: true, section: "add", fn: "showEdit"},
  profile: {page: profile, title: "Profil Saya",       nav: "profile"},
  about:   {page: about,   title: "Tentang Aplikasi",  nav: "about"},
  vehicle: {page: vehicle, title: "Detail",            nav: "home",   back: true},
  brand:   {page: brand,   title: "Merek",             nav: "brands", back: true}
};

function route(){
  const [, p = "", id] = (location.hash || "#/").slice(1).split("/");
  if(p === "random"){   // #/random: buka detail kendaraan acak (dipakai halaman Tentang)
    const v = state.vehicles[Math.floor(Math.random() * state.vehicles.length)];
    location.replace(v ? "#/vehicle/" + v.id : "#/"); return;
  }
  const key = ROUTES[p] ? p : "home", r = ROUTES[key];
  $("#loading").hidden = true;
  $$(".page").forEach(s => s.hidden = s.id !== "page-" + (r.section || key));
  $("#back").hidden = !r.back; $(".mark").hidden = key !== "home";
  $$("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === r.nav));
  $("#title").textContent = r.page[r.fn || "show"](id) || r.title;
  window.scrollTo(0, 0);
}

export function startRouter(){
  new Set(Object.values(ROUTES).map(r => r.page)).forEach(pg => pg.init?.());
  $("#back").onclick = () => history.length > 1 ? history.back() : (location.hash = "#/");
  window.addEventListener("hashchange", route);
  route();
}
