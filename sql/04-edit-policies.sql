-- LANGKAH 4 (fitur edit kendaraan). Supabase > SQL Editor > New query > Run.
-- Instalasi baru: jalankan 01, 02, lalu file ini.
-- PERHATIAN: siapa pun yang memegang anon key bisa mengubah kendaraan. Untuk produksi, batasi dengan Supabase Auth
-- (mis. using (auth.uid() = owner_id)).
create policy "vehicles_update" on vehicles for update
  using (true)
  with check (char_length(name) between 1 and 80 and price > 0);
