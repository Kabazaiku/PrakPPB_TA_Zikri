// Helper DOM kecil yang dipakai semua modul.
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
/** Menggandakan isi <template id="..."> */
export const clone = id => $("#" + id).content.firstElementChild.cloneNode(true);
/** Mengisi textContent elemen ber-atribut data-b="nama" dari objek. */
export const bind = (root, o) => $$("[data-b]", root).forEach(e => e.textContent = o[e.dataset.b] ?? "");

let timer;
export function toast(msg){
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(timer); timer = setTimeout(() => t.classList.remove("show"), 2200);
}
