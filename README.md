# Wheelie: Katalog Roda Dua (PWA)

Motor, sepeda, dan sepeda listrik. HTML + CSS + JavaScript (ES modules), backend Supabase.

## Struktur
```
wheelie/
├─ index.html            Semua halaman (<section>) dan templat
├─ manifest.json         Manifest PWA
├─ sw.js                 Service worker (harus di root)
├─ package.json          Skrip: npm start (lokal) / npm run build (deploy)
├─ vercel.json           Pengaturan Vercel (build + folder public)
├─ .env.example          Salin ke .env, isi kunci Supabase
├─ css/style.css
├─ js/
│  ├─ main.js            Titik masuk
│  ├─ router.js          Rute hash -> halaman
│  ├─ install.js         Tombol Pasang (PWA)
│  ├─ config.js          DIBUAT dari .env (jangan commit)
│  ├─ lib/               dom, storage, format, image, pager
│  ├─ data/              state, api (Supabase/lokal), demo
│  ├─ components/        cards (kartu kendaraan/merek, logo, gambar)
│  └─ pages/             home, brands, vehicle, brand, add (tambah+edit), favorites, profile, about
├─ assets/
│  ├─ icons/             ikon PWA (svg, png 192/512, maskable, apple-touch)
│  ├─ logos/             logo merek: honda, yamaha, suzuki (.svg)
│  └─ placeholders/      6 ilustrasi kendaraan (.svg)
├─ scripts/build-config.js   .env -> js/config.js
└─ sql/                  01-schema, 02-upload-policies, 03-migrasi-logo, 04-edit-policies
```

## Menjalankan
1. Supabase > SQL Editor: jalankan `sql/01-schema.sql`, `sql/02-upload-policies.sql`, lalu `sql/04-edit-policies.sql` (agar kendaraan bisa diedit).
   (Database lama tanpa kolom `logo_url`: jalankan `sql/03-migrasi-logo.sql`.)
2. `cp .env.example .env` (nama persis `.env`, satu folder dengan `package.json`), isi `SUPABASE_URL` dan `SUPABASE_ANON_KEY` tanpa tanda kutip. Jangan pakai service_role key. Setelah mengubah `.env`, jalankan ulang `npm start`.
3. `npm start` lalu buka http://localhost:3000. Tidak bisa dibuka lewat file://, ES modules dan service worker butuh server.

Tanpa `.env`, aplikasi berjalan dengan data demo.

## Deploy ke Vercel
`npm run build` membuat `js/config.js` dari environment variable lalu menyalin hanya file situs ke `public/` (tanpa sql/, scripts/, .env). `vercel.json` sudah mengatur ini.
1. Unggah isi folder `wheelie` ke repositori GitHub (file seperti `package.json` harus berada di akar repo; jika berada dalam subfolder, isi **Root Directory** di Vercel dengan nama subfolder itu). Vercel tidak menerima file zip langsung.
2. Vercel > Add New > Project > pilih repositori. Framework Preset: **Other**. Build Command dan Output Directory otomatis dari `vercel.json` (`npm run build` dan `public`).
3. Sebelum Deploy, buka **Environment Variables** dan tambahkan `SUPABASE_URL` dan `SUPABASE_ANON_KEY`. Jika baru menambah variabel setelah deploy, lakukan **Redeploy**.
4. Deploy lewat CLI: `npm i -g vercel`, lalu `vercel` di folder ini (variabel diatur di dashboard).
Jika variabel kosong, situs tetap tampil tetapi memakai data demo. Log build menampilkan PERINGATAN.

Netlify: Build command `npm run build`, Publish directory `public`.

## Edit kendaraan
Buka detail kendaraan, ketuk ikon pensil. Nama, merek, kategori, jenis, harga, deskripsi, spesifikasi, dan gambar bisa diubah. Di Supabase fitur ini butuh `sql/04-edit-policies.sql`. Catatan: tanpa login, siapa pun yang memegang anon key bisa mengedit; untuk produksi tambahkan Supabase Auth.

## Logo merek
Aplikasi mencari `assets/logos/<nama>.svg`, lalu `.png`, lalu `.webp` (nama = nama merek huruf kecil tanpa spasi, mis. `polygon.png`). Tidak perlu mendaftarkan apa pun di kode. Bisa juga mengisi kolom `logo_url` di tabel `brands`, atau mengunggah logo saat menambah merek baru lewat form Tambah. Jika logo tidak ada, ditampilkan huruf awal pada kotak berwarna.

## Gambar kendaraan
Jika `image_url` kosong, dipakai ilustrasi dari `assets/placeholders/` sesuai kategori dan jenis. Di form Tambah, pengguna bisa memilih ilustrasi atau mengunggah foto sendiri.

## Tombol Pasang tidak muncul?
Tombol hanya muncul jika browser mengirim penawaran pemasangan (Chrome/Edge/Android). Halaman Tentang menampilkan diagnostik dan petunjuk pasang manual sesuai browser Anda. Penyebab umum:
- Wheelie versi lama sudah terpasang: browser tidak menawarkan ulang. Buka `chrome://apps`, hapus atau buka dari sana.
- Penawaran pernah ditutup/ditolak: browser menunggu beberapa hari. Pasang manual lewat ikon di kolom alamat atau menu.
- Jendela Incognito, Firefox desktop, atau alamat `http://192.168.x.x` (bukan localhost/HTTPS) tidak mendukung pemasangan.
- Untuk memeriksa langsung: DevTools > Application > Manifest, lihat bagian Installability.
iOS (Safari): Bagikan > Tambahkan ke Layar Utama.

## Catatan
- Setelah mengubah file, naikkan `CACHE` di `sw.js` agar PWA memuat versi baru.
- Logo dari Simple Icons; logo adalah merek dagang pemiliknya.
