-- LANGKAH 2. Mengizinkan pengunjung menambah kendaraan/merek dan mengunggah gambar.
-- PERHATIAN: siapa pun yang memegang anon key bisa menambah data. Untuk produksi, batasi dengan Supabase Auth.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vehicle-images', 'vehicle-images', true, 1048576, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "img_read"   on storage.objects for select using (bucket_id = 'vehicle-images');
create policy "img_insert" on storage.objects for insert with check (bucket_id = 'vehicle-images');
create policy "brands_insert" on brands for insert with check (char_length(name) between 1 and 60);
create policy "vehicles_insert" on vehicles for insert with check (char_length(name) between 1 and 80 and price > 0);
