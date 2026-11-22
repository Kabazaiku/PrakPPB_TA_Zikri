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

/** Status pemasangan + pesan yang menjelaskan apa yang bisa dilakukan pengguna. */
export function installStatus(){
  const b = browserName(), android = /Android/i.test(ua);
  if(standalone()) return {state: "installed", msg: "Wheelie sudah berjalan sebagai aplikasi terpasang."};
  if(deferred) return {state: "ready", msg: "Pasang agar Wheelie terbuka seperti aplikasi dan bisa dipakai offline."};
  if(/iphone|ipad|ipod/i.test(ua)) return {state: "ios", msg: "Di Safari, ketuk tombol Bagikan lalu pilih Tambahkan ke Layar Utama."};
  if(!isSecureContext) return {state: "insecure", msg: `Pemasangan butuh HTTPS atau localhost, sedangkan halaman ini dibuka lewat ${location.origin}.`};
  const how = b === "Firefox" ? (android ? "Firefox Android: menu, lalu Instal." : "Firefox desktop tidak mendukung pemasangan PWA. Gunakan Chrome atau Edge.")
    : b === "Edge" ? "Edge: menu (…), lalu Aplikasi, lalu Instal situs ini sebagai aplikasi."
    : b === "Safari" ? "Safari desktop: menu File, lalu Tambahkan ke Dock."
    : android ? `${b}: menu (⋮), lalu Instal aplikasi atau Tambahkan ke layar utama.`
    : `${b}: klik ikon pasang di ujung kanan kolom alamat, atau menu (⋮), lalu Transmisikan, simpan, dan bagikan, lalu Instal halaman sebagai aplikasi.`;
  return {state: "manual", msg: `Browser belum mengirim penawaran pemasangan otomatis. Pasang manual: ${how} Jika sebelumnya sudah memasang versi lama Wheelie, buka chrome://apps untuk membukanya atau menghapusnya dulu, karena browser tidak menawarkan ulang aplikasi yang sudah terpasang.`};
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
