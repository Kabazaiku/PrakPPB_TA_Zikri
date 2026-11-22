import {$, clone, bind} from "../lib/dom.js";
import {rp, placeholderFor, LOGO_EXT, monoColor} from "../lib/format.js";
import {state, brandOf, nameOf} from "../data/state.js";

/** Foto kendaraan sebagai background; bila kosong, pakai ilustrasi bawaan sesuai kategori/jenis. */
export function setImage(el, v){
  const src = v.image_url || placeholderFor(v);
  el.style.backgroundImage = `url("${src.replace(/"/g, "%22")}")`;
}

const logoCache = new Map();  // slug -> url logo yang berhasil dimuat ("" = tidak ada)

/**
 * Logo merek. Urutan: logo_url dari database, lalu assets/logos/<slug>.svg|png|webp.
 * Jika tidak ada, tampilkan huruf awal pada kotak berwarna.
 */
export function setLogo(box, b){
  const img = $("img", box), fb = $(".logo-fb", box), name = b?.name || "?";
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const showMono = () => { img.hidden = true; fb.hidden = false; box.classList.add("mono"); box.style.setProperty("--mono", monoColor(name)); };
  fb.textContent = name[0].toUpperCase(); showMono();
  const known = logoCache.get(slug + (b?.logo_url || ""));
  const urls = known !== undefined ? (known ? [known] : [])
    : [b?.logo_url, ...(slug ? LOGO_EXT.map(e => `assets/logos/${slug}.${e}`) : [])].filter(Boolean);
  let i = 0;
  const next = () => {
    if(i >= urls.length){ logoCache.set(slug + (b?.logo_url || ""), ""); return; }
    img.src = urls[i++];
  };
  img.onload = () => { logoCache.set(slug + (b?.logo_url || ""), img.getAttribute("src")); img.hidden = false; fb.hidden = true; box.classList.remove("mono"); };
  img.onerror = next;
  next();
}

export function vehicleCard(v){
  const a = clone("tpl-vehicle"); a.href = "#/vehicle/" + v.id;
  bind(a, {title: nameOf(v), category: v.category, type: v.type, price: rp(v.price)});
  setImage($(".thumb", a), v); return a;
}

export function brandCard(b){
  const a = clone("tpl-brand"), n = state.vehicles.filter(v => v.brand_id === b.id).length;
  a.href = "#/brand/" + b.id;
  bind(a, {name: b.name, country: b.country || "-", count: n + " model"});
  setLogo($(".logo", a), b); return a;
}

/** Mengisi grid kendaraan dengan item halaman aktif; `total` = jumlah seluruh hasil. */
export function fillVehicles(list, empty, pageItems, total){
  list.replaceChildren(...pageItems.map(vehicleCard)); empty.hidden = total > 0;
}
