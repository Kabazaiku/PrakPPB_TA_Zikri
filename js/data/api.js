// Semua akses data (Supabase atau penyimpanan lokal) ada di sini.
import {state} from "./state.js";
import {DEMO} from "./demo.js";
import {store, save} from "../lib/storage.js";
import {blobToDataURL} from "../lib/image.js";
import {toast} from "../lib/dom.js";

const EMPTY = {brands: [], vehicles: []};

export async function loadData(){
  const c = window.CONFIG || {};
  try{
    if(!c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) throw new Error("no-config");
    if(!window.supabase) throw new Error("library Supabase gagal dimuat, periksa koneksi internet");
    state.db = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY);
    const [b, v] = await Promise.all([state.db.from("brands").select("*").order("name"), state.db.from("vehicles").select("*").order("name")]);
    if(b.error) throw b.error; if(v.error) throw v.error;
    state.brands = b.data; state.vehicles = v.data; save("cache", {brands: b.data, vehicles: v.data});
  }catch(e){
    if(e.message !== "no-config"){ state.loadError = e.message || String(e); console.error("[Wheelie] Gagal memuat dari Supabase:", e); }
    const cache = store("cache", null);
    if(cache && e.message !== "no-config"){ state.brands = cache.brands; state.vehicles = cache.vehicles; toast("Offline: memakai data tersimpan"); }
    else { const d = structuredClone(DEMO); state.brands = d.brands; state.vehicles = d.vehicles; state.demo = true; }
  }
  const l = store("localData", EMPTY);
  state.brands = [...state.brands, ...l.brands]; state.vehicles = [...state.vehicles, ...l.vehicles];
}

/**
 * Menambah kendaraan. Mode Supabase: insert ke tabel + unggah gambar ke Storage.
 * Mode demo: simpan di localStorage (gambar sebagai data URL).
 */
async function uploadImage(blob, folder, ext, type){
  const path = `${folder}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const up = await state.db.storage.from("vehicle-images").upload(path, blob, {contentType: type}); if(up.error) throw up.error;
  return state.db.storage.from("vehicle-images").getPublicUrl(path).data.publicUrl;
}

export async function createVehicle({rec, blob, brandId, newBrandName, brandLogo}){
  const isNew = brandId === "__new";
  let brand = state.brands.find(b => String(b.id) === brandId), row;
  if(isNew){ if(!newBrandName) throw new Error("Isi nama merek baru"); brand = {name: newBrandName, country: null, description: null}; }

  if(state.db){
    const db = state.db;
    if(isNew){
      if(brandLogo) brand.logo_url = await uploadImage(brandLogo, "logos/", "png", "image/png");
      const r = await db.from("brands").insert(brand).select().single(); if(r.error) throw r.error; brand = r.data;
    }
    if(blob) rec.image_url = await uploadImage(blob, "", "jpg", "image/jpeg");
    const r = await db.from("vehicles").insert({...rec, brand_id: brand.id}).select().single(); if(r.error) throw r.error;
    row = r.data;
    const c = store("cache", null); if(c){ if(isNew) c.brands.push(brand); c.vehicles.push(row); save("cache", c); }
  }else{
    const l = store("localData", EMPTY);
    if(isNew){ brand.id = "lb" + Date.now(); if(brandLogo) brand.logo_url = await blobToDataURL(brandLogo); l.brands.push(brand); }
    if(blob) rec.image_url = await blobToDataURL(blob);
    row = {...rec, id: "lv" + Date.now(), brand_id: brand.id}; l.vehicles.push(row);
    try{ save("localData", l); }catch{ throw new Error("Penyimpanan perangkat penuh"); }
  }
  if(isNew) state.brands.push(brand);
  state.vehicles.push(row);
  return row;
}
