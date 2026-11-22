import {$} from "../lib/dom.js";
import {installStatus, install, onInstallChange, browserName, eventReceived} from "../install.js";

export function init(){
  $("#inst2").onclick = install;
  onInstallChange(() => { if(!$("#page-about").hidden) show(); });
}

async function swState(){
  if(!("serviceWorker" in navigator)) return "tidak didukung";
  const r = await navigator.serviceWorker.getRegistration();
  return !r ? "belum terdaftar" : r.active ? "aktif" : "sedang dipasang";
}

export function show(){
  const s = installStatus();
  $("#inst-msg").textContent = s.msg; $("#inst2").hidden = s.state !== "ready";
  const diag = sw => $("#inst-diag").textContent = `Diagnostik: ${browserName()} · koneksi aman ${isSecureContext ? "ya" : "tidak"} · service worker ${sw} · penawaran pemasangan ${eventReceived() ? "diterima" : "belum diterima"} · mode ${s.state === "installed" ? "terpasang" : "browser"}`;
  diag("memeriksa…");
  const update = () => swState().then(diag);
  update();
  // Pendaftaran service worker bisa selesai setelah halaman ini tampil, jadi periksa lagi saat sudah siap.
  if("serviceWorker" in navigator) navigator.serviceWorker.ready.then(update, () => {});
}
