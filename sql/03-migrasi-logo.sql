-- MIGRASI untuk database lama (tanpa kolom logo_url). Instalasi baru TIDAK perlu file ini.
alter table brands add column if not exists logo_url text;

update brands set logo_url = 'assets/logos/honda.svg'  where name = 'Honda';
update brands set logo_url = 'assets/logos/yamaha.svg' where name = 'Yamaha';

insert into brands (name, country, description, logo_url)
select 'Suzuki','Jepang','Menawarkan motor irit dan tangguh untuk pemakaian sehari-hari.','assets/logos/suzuki.svg'
where not exists (select 1 from brands where name = 'Suzuki');

insert into vehicles (brand_id,name,category,type,price,description,specs)
select id,'Satria F150','Motor','Sport',27000000,'Underbone bertenaga dengan mesin DOHC.',
 '{"Mesin":"147 cc","Tenaga":"16,3 PS","Berat":"109 kg","Tangki":"4 L"}'::jsonb
from brands where name = 'Suzuki'
and not exists (select 1 from vehicles where name = 'Satria F150');
