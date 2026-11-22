export const rp = n => "Rp " + Number(n).toLocaleString("id-ID");

/** Ilustrasi bawaan di assets/placeholders/<id>.svg, dipilih dari kategori dan jenis. */
export function placeholderFor(v){
  const t = (v.type || "").toLowerCase();
  const id = v.category === "Motor" ? (t.includes("sport") ? "motor-sport" : t.includes("trail") ? "motor-trail" : "motor-matic")
    : v.category === "Sepeda Listrik" ? "sepeda-listrik"
    : t.includes("lipat") ? "sepeda-lipat" : "sepeda-gunung";
  return `assets/placeholders/${id}.svg`;
}

/** Format logo yang dicoba berurutan untuk assets/logos/<slug>.<ext> */
export const LOGO_EXT = ["svg", "png", "webp"];

/** Warna tetap untuk huruf awal merek (dari nama), dipakai jika logo tidak ada. */
export function monoColor(name){
  let h = 0; for(const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return `hsl(${h} 55% 36%)`;
}
