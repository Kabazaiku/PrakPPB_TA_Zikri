import {$, $$, clone, toast} from "../lib/dom.js";
import {resize} from "../lib/image.js";
import {state} from "../data/state.js";
import {createVehicle} from "../data/api.js";

const addSpecRow = () => $("#specs").append(clone("tpl-specrow"));

export function init(){
  $("#b").onchange = e => { const isNew = e.target.value === "__new"; $("#nb-box").hidden = !isNew; $("#nb").required = isNew; };
  $("#more").onclick = addSpecRow;
  // Foto unggahan menggantikan ilustrasi, dan sebaliknya.
  $("#img").onchange = e => {
    const f = e.target.files[0], pv = $("#pv"); pv.hidden = !f;
    if(f){ pv.src = URL.createObjectURL(f); $$("[name=ph]").forEach(r => r.checked = false); }
  };
  $$("[name=ph]").forEach(r => r.onchange = () => { $("#img").value = ""; $("#pv").hidden = true; });
  $("#f").onsubmit = submit;
}

export function show(){
  const sel = $("#b"), old = sel.value;
  sel.replaceChildren(...state.brands.map(b => new Option(b.name, b.id)), new Option("+ Merek baru…", "__new"));
  if([...sel.options].some(o => o.value === old)) sel.value = old;
  if(!$("#specs").children.length){ addSpecRow(); addSpecRow(); }
  $("#add-note").textContent = state.demo ? "Mode demo: data disimpan di perangkat ini saja." : "Data dikirim ke Supabase dan terlihat oleh semua pengguna.";
}

async function submit(e){
  e.preventDefault();
  const btn = $("#save"); btn.disabled = true;
  try{
    const specs = {};
    $$(".spec-row").forEach(r => { const [k, v] = $$("input", r); if(k.value.trim() && v.value.trim()) specs[k.value.trim()] = v.value.trim(); });
    const file = $("#img").files[0], logo = $("#nl").files[0], ph = $("[name=ph]:checked")?.value || null;
    const row = await createVehicle({
      rec: {name: $("#n").value.trim(), category: $("#c").value, type: $("#t").value.trim(), price: Number($("#p").value), description: $("#d").value.trim(), specs, image_url: file ? null : ph},
      blob: file ? await resize(file) : null,
      brandId: $("#b").value, newBrandName: $("#nb").value.trim(),
      brandLogo: logo && $("#b").value === "__new" ? await resize(logo, 256, "image/png") : null
    });
    toast("Kendaraan ditambahkan");
    e.target.reset(); $("#specs").replaceChildren(); $("#pv").hidden = true; $("#nb-box").hidden = true; $("[name=ph]").checked = true;
    location.hash = "#/vehicle/" + row.id;
  }catch(err){ toast("Gagal: " + (err.message || err)); }
  btn.disabled = false;
}
