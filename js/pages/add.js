// Form kendaraan: dipakai untuk menambah (#/add) dan mengedit (#/edit/ID).
import {$, $$, clone, toast} from "../lib/dom.js";
import {resize} from "../lib/image.js";
import {rp} from "../lib/format.js";
import {state} from "../data/state.js";
import {createVehicle, updateVehicle} from "../data/api.js";

let editing = null;   // kendaraan yang sedang diedit; null = mode tambah

function addSpecRow(k = "", v = ""){
  const r = clone("tpl-specrow"), [a, b] = $$("input", r); a.value = k; b.value = v; $("#specs").append(r);
}

const priceHint = () => { const n = Number($("#p").value); $("#p-hint").textContent = n > 0 ? rp(n) : ""; };

function resetForm(){
  $("#f").reset(); $("#p-hint").textContent = ""; $("#specs").replaceChildren(); $("#pv").hidden = true; $("#nb-box").hidden = true; $("#ph-keep").hidden = true;
}

function fillBrands(selected){
  const sel = $("#b"), old = String(selected ?? sel.value);
  sel.replaceChildren(...state.brands.map(b => new Option(b.name, b.id)), new Option("+ Merek baru…", "__new"));
  if([...sel.options].some(o => o.value === old)) sel.value = old;
  $("#nb-box").hidden = sel.value !== "__new";
}

function labels(){
  $("#save span").textContent = editing ? "Simpan perubahan" : "Simpan kendaraan";
  $("#add-note").textContent = state.demo ? "Mode demo: data disimpan di perangkat ini saja." : "Data dikirim ke Supabase dan terlihat oleh semua pengguna.";
}

/** Pilihan gambar saat edit: ilustrasi yang cocok, atau "Foto saat ini" untuk foto unggahan. */
function chooseImage(v){
  const radios = $$("[name=ph]"), match = v.image_url && radios.find(r => r.value === v.image_url);
  if(match) match.checked = true;
  else if(v.image_url){ $("#ph-keep img").src = v.image_url; $("#ph-keep").hidden = false; $("#ph-keep input").checked = true; }
  else radios.find(r => r.value === "").checked = true;
}

export function init(){
  $("#b").onchange = e => { const isNew = e.target.value === "__new"; $("#nb-box").hidden = !isNew; $("#nb").required = isNew; };
  $("#more").onclick = () => addSpecRow();
  $("#p").oninput = priceHint;
  // Foto unggahan menggantikan ilustrasi, dan sebaliknya.
  $("#img").onchange = e => {
    const f = e.target.files[0], pv = $("#pv"); pv.hidden = !f;
    if(f){ pv.src = URL.createObjectURL(f); $$("[name=ph]").forEach(r => r.checked = false); }
  };
  $$("[name=ph]").forEach(r => r.onchange = () => { $("#img").value = ""; $("#pv").hidden = true; });
  $("#f").onsubmit = submit;
}

export function show(){
  if(editing){ editing = null; resetForm(); }
  fillBrands();
  if(!$("#specs").children.length){ addSpecRow(); addSpecRow(); }
  labels();
}

export function showEdit(id){
  const v = state.vehicles.find(x => String(x.id) === id);
  if(!v){ toast("Kendaraan tidak ditemukan"); location.replace("#/"); return; }
  editing = v; resetForm(); fillBrands(v.brand_id);
  $("#n").value = v.name; $("#c").value = v.category; $("#t").value = v.type; $("#p").value = v.price; $("#d").value = v.description || ""; priceHint();
  Object.entries(v.specs || {}).forEach(([k, val]) => addSpecRow(k, val)); addSpecRow();
  chooseImage(v); labels();
}

async function submit(e){
  e.preventDefault();
  const btn = $("#save"); btn.disabled = true;
  try{
    const specs = {};
    $$(".spec-row").forEach(r => { const [k, v] = $$("input", r); if(k.value.trim() && v.value.trim()) specs[k.value.trim()] = v.value.trim(); });
    const file = $("#img").files[0], logo = $("#nl").files[0], ph = $("[name=ph]:checked")?.value ?? "";
    const rec = {name: $("#n").value.trim(), category: $("#c").value, type: $("#t").value.trim(), price: Number($("#p").value), description: $("#d").value.trim(), specs,
      image_url: file ? null : ph === "__keep" ? editing?.image_url ?? null : (ph || null)};
    const data = {
      rec, blob: file ? await resize(file) : null,
      brandId: $("#b").value, newBrandName: $("#nb").value.trim(),
      brandLogo: logo && $("#b").value === "__new" ? await resize(logo, 256, "image/png") : null
    };
    const row = editing ? await updateVehicle(editing, data) : await createVehicle(data);
    toast(editing ? "Perubahan disimpan" : "Kendaraan ditambahkan");
    editing = null; resetForm();
    location.hash = "#/vehicle/" + row.id;
  }catch(err){ toast("Gagal: " + (err.message || err)); }
  btn.disabled = false;
}
