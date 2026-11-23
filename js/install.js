// Tombol "Pasang" PWA. Chrome/Edge mengirim beforeinstallprompt hanya jika syarat PWA terpenuhi
// dan aplikasi belum terpasang. Selain itu pengguna diberi petunjuk pemasangan manual.
import {$, toast} from "./lib/dom.js";

let deferred = window.__bip || null;   // event yang sudah ditangkap skrip awal di index.html
let received = !!deferred;
const listeners = [];
const ua = navigator.userAgent;
const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
export const onInstallChange = fn => listeners.push(fn);
const notify = () => { $("#install").hidden = !deferred; listeners.forEach(f => f()); };

export function browserName(){
  if(navigator.brave) return "Brave";
  if(/Edg\//.test(ua)) return "Edge";
  if(/OPR\//.test(ua)) return "Opera";
  if(/Firefox\//.test(ua)) return "Firefox";
  if(/Chrome\//.test(ua)) return "Chrome";
  if(/Safari\//.test(ua)) return "Safari";
  return "browser ini";
}
export const eventReceived = () => received;

/** Status pemasangan: msg = pesan singkat, help = bantuan tambahan (ditampilkan di "Bantuan dan detail teknis"). */
export function installStatus(){
  const b = browserName(), android = /Android/i.test(ua);
  if(standalone()) return {state: "installed", msg: "Wheelie sudah berjalan sebagai aplikasi terpasang."};
  if(deferred) return {state: "ready", msg: "Pasang agar Wheelie terbuka seperti aplikasi dan bisa dipakai offline."};
  if(/iphone|ipad|ipod/i.test(ua)) return {state: "ios", msg: "Di Safari, ketuk tombol Bagikan lalu pilih Tambahkan ke Layar Utama."};
  if(!isSecureContext) return {state: "insecure", msg: `Pemasangan butuh HTTPS atau localhost, sedangkan halaman ini dibuka lewat ${location.origin}.`};
  const how = b === "Firefox" ? (android ? "Di Firefox Android, buka menu lalu pilih Instal." : "Firefox desktop tidak mendukung pemasangan. Gunakan Chrome atau Edge.")
    : b === "Edge" ? "Buka menu (…) lalu Aplikasi, lalu Instal situs ini sebagai aplikasi."
    : b === "Safari" ? "Di Safari desktop, buka menu File lalu Tambahkan ke Dock."
    : android ? "Buka menu (⋮) lalu pilih Instal aplikasi atau Tambahkan ke layar utama."
    : "Klik ikon pasang di kolom alamat, atau buka menu (⋮) lalu Transmisikan, simpan, dan bagikan, lalu Instal halaman sebagai aplikasi.";
  return {state: "manual", msg: `Pemasangan otomatis belum tersedia. ${how}`,
    help: "Sudah pernah memasang Wheelie? Browser tidak menawarkan ulang aplikasi yang sudah terpasang, buka atau hapus lewat chrome://apps. Penawaran yang pernah ditutup juga bisa tertunda beberapa hari."};
}

export async function install(){
  if(!deferred){ toast("Lihat petunjuk di halaman Tentang"); location.hash = "#/about"; return; }
  deferred.prompt(); await deferred.userChoice; deferred = null; window.__bip = null; notify();
}

export function initInstall(){
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; received = true; notify(); });
  window.addEventListener("appinstalled", () => { deferred = null; notify(); toast("Aplikasi terpasang"); });
  $("#install").onclick = install;
  if(deferred) notify();
}
