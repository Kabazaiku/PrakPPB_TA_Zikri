// 1) Membaca .env (atau environment variable hosting) lalu menulis js/config.js.
// 2) Dengan opsi --public: menyalin hanya file situs ke folder public/ (untuk Vercel/Netlify).
// Tanpa dependency. Jalankan: node scripts/build-config.js [--public]
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const env = {};
const file = path.join(root, ".env");
if (fs.existsSync(file)) {
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !line.trim().startsWith("#")) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const get = k => process.env[k] || env[k] || "";
const cfg = { SUPABASE_URL: get("SUPABASE_URL"), SUPABASE_ANON_KEY: get("SUPABASE_ANON_KEY") };
fs.writeFileSync(path.join(root, "js", "config.js"),
  "// File ini DIBUAT OTOMATIS dari .env oleh scripts/build-config.js. Jangan diedit.\nwindow.CONFIG = " + JSON.stringify(cfg, null, 2) + ";\n");
console.log(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY
  ? "js/config.js dibuat dari .env / environment variable"
  : "PERINGATAN: SUPABASE_URL / SUPABASE_ANON_KEY kosong. Aplikasi akan berjalan dengan data demo.");

if (process.argv.includes("--public")) {
  const out = path.join(root, "public");
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out);
  for (const f of ["index.html", "manifest.json", "sw.js", "css", "js", "assets"]) {
    fs.cpSync(path.join(root, f), path.join(out, f), { recursive: true });
  }
  console.log("Situs disalin ke public/");
}
