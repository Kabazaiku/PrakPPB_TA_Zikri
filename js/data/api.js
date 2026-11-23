// Semua akses data (Supabase atau penyimpanan lokal) ada di sini.
import {state} from "./state.js";
import {DEMO} from "./demo.js";
import {store, save} from "../lib/storage.js";
import {blobToDataURL} from "../lib/image.js";
import {toast} from "../lib/dom.js";

// Data lokal (mode demo): merek/kendaraan buatan pengguna + perubahan (overrides) atas data demo.
const localData = () => ({brands: [], vehicles: [], overrides: {}, ...store("localData", {})});
const saveLocal = l => { try{ save("localData", l); }catch{ throw new Error("Penyimpanan perangkat penuh"); } };
const isLocalId = id => typeof id === "string" && id.startsWith("lv");

export async function loadData(){
  const c = window.CONFIG || {};
  try{
    if(!c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) throw new Error("no-config");
    state.db = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY);
    const [b, v] = await Promise.all([state.db.from("brands").select("*").order("name"), state.db.from("vehicles").select("*").order("name")]);
    if(b.error) throw b.error; if(v.error) throw v.error;
    state.brands = b.data; state.vehicles = v.data; save("cache", {brands: b.data, vehicles: v.data});
  }catch(e){
    const cache = store("cache", null);
    if(cache && e.message !== "no-config"){ state.brands = cache.brands; state.vehicles = cache.vehicles; toast("Offline: memakai data tersimpan"); }
    else { const d = structuredClone(DEMO); state.brands = d.brands; state.vehicles = d.vehicles; state.demo = true; }
  }
  const l = localData();
  state.brands = [...state.brands, ...l.brands]; state.vehicles = [...state.vehicles, ...l.vehicles];
  if(state.demo) state.vehicles = state.vehicles.map(v => l.overrides[v.id] ? {...v, ...l.overrides[v.id]} : v);
}

async function uploadImage(blob, folder, ext, type){
  const path = `${folder}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const up = await state.db.storage.from("vehicle-images").upload(path, blob, {contentType: type}); if(up.error) throw up.error;
  return state.db.storage.from("vehicle-images").getPublicUrl(path).data.publicUrl;
}

/** Mengembalikan merek terpilih; membuat merek baru (dengan logo opsional) jika brandId === "__new". */
async function resolveBrand({brandId, newBrandName, brandLogo}){
  if(brandId !== "__new") return state.brands.find(b => String(b.id) === brandId);
  if(!newBrandName) throw new Error("Isi nama merek baru");
  let brand = {name: newBrandName, country: null, description: null};
  if(state.db){
    if(brandLogo) brand.logo_url = await uploadImage(brandLogo, "logos/", "png", "image/png");
    const r = await state.db.from("brands").insert(brand).select().single(); if(r.error) throw r.error;
    brand = r.data;
    const c = store("cache", null); if(c){ c.brands.push(brand); save("cache", c); }
  }else{
    const l = localData();
    brand.id = "lb" + Date.now(); if(brandLogo) brand.logo_url = await blobToDataURL(brandLogo);
    l.brands.push(brand); saveLocal(l);
  }
  state.brands.push(brand);
  return brand;
}

/** Menambah kendaraan (Supabase: insert + Storage; demo: localStorage). */
export async function createVehicle({rec, blob, ...b}){
  const brand = await resolveBrand(b);
  let row;
  if(state.db){
    if(blob) rec.image_url = await uploadImage(blob, "", "jpg", "image/jpeg");
    const r = await state.db.from("vehicles").insert({...rec, brand_id: brand.id}).select().single(); if(r.error) throw r.error;
    row = r.data;
    const c = store("cache", null); if(c){ c.vehicles.push(row); save("cache", c); }
  }else{
    if(blob) rec.image_url = await blobToDataURL(blob);
    row = {...rec, id: "lv" + Date.now(), brand_id: brand.id};
    const l = localData(); l.vehicles.push(row); saveLocal(l);
  }
  state.vehicles.push(row);
  return row;
}

/** Mengubah kendaraan `v`. Supabase: update (butuh policy sql/04-edit-policies.sql). Demo: disimpan lokal. */
export async function updateVehicle(v, {rec, blob, ...b}){
  const brand = await resolveBrand(b);
  const fields = {...rec, brand_id: brand.id};
  let row;
  if(state.db && !isLocalId(v.id)){
    if(blob) fields.image_url = await uploadImage(blob, "", "jpg", "image/jpeg");
    const r = await state.db.from("vehicles").update(fields).eq("id", v.id).select().single();
    if(r.error) throw new Error(r.error.code === "PGRST116" ? "Tidak ada izin mengubah data. Jalankan sql/04-edit-policies.sql di Supabase." : r.error.message);
    row = r.data;
    const c = store("cache", null); if(c){ c.vehicles = c.vehicles.map(x => x.id === row.id ? row : x); save("cache", c); }
  }else{
    if(blob) fields.image_url = await blobToDataURL(blob);
    row = {...v, ...fields};
    const l = localData();
    if(isLocalId(v.id)) l.vehicles = l.vehicles.map(x => x.id === v.id ? row : x);
    else l.overrides[v.id] = fields;
    saveLocal(l);
  }
  state.vehicles = state.vehicles.map(x => x.id === v.id ? row : x);
  return row;
}
