// Data contoh, dipakai bila Supabase belum dikonfigurasi atau gagal dimuat.
export const DEMO = {
  brands: [
    {id:1,name:"Honda",country:"Jepang",description:"Pabrikan motor terbesar di dunia, kuat di segmen matic dan bebek."},
    {id:2,name:"Yamaha",country:"Jepang",description:"Dikenal lewat teknologi Blue Core dan motor sport harian."},
    {id:3,name:"Polygon",country:"Indonesia",description:"Merek sepeda asal Sidoarjo yang diekspor ke banyak negara."},
    {id:4,name:"United",country:"Indonesia",description:"Sepeda harian, lipat, dan gunung dengan harga terjangkau."},
    {id:5,name:"Selis",country:"Indonesia",description:"Produsen motor dan sepeda listrik lokal."},
    {id:6,name:"Suzuki",country:"Jepang",description:"Menawarkan motor irit dan tangguh untuk pemakaian sehari-hari."}],
  vehicles: [
    {id:1,brand_id:1,name:"Vario 160",category:"Motor",type:"Matic",price:27500000,description:"Matic sporty yang irit dan responsif untuk kota.",specs:{Mesin:"157 cc",Tenaga:"15,7 PS",Berat:"116 kg",Tangki:"5,5 L"}},
    {id:2,brand_id:2,name:"NMAX 155",category:"Motor",type:"Matic",price:33000000,description:"Maxi scooter nyaman dengan bagasi luas dan ABS.",specs:{Mesin:"155 cc",Tenaga:"15,1 PS",Berat:"131 kg",Tangki:"7,1 L"}},
    {id:3,brand_id:2,name:"R15 V4",category:"Motor",type:"Sport",price:42000000,description:"Sport fairing dengan VVA dan quickshifter.",specs:{Mesin:"155 cc",Tenaga:"18,4 PS",Berat:"141 kg",Tangki:"11 L"}},
    {id:4,brand_id:1,name:"CRF150L",category:"Motor",type:"Trail",price:36000000,description:"Trail ringan untuk jalan rusak maupun harian.",specs:{Mesin:"149 cc",Tenaga:"12,4 PS",Berat:"119 kg",Tangki:"7,3 L"}},
    {id:5,brand_id:3,name:"Xtrada 5",category:"Sepeda",type:"MTB",price:6500000,description:"Sepeda gunung rangka alumunium untuk jalan campuran.",specs:{Rangka:"Alumunium",Roda:"29 inci",Transmisi:"21 speed",Rem:"Cakram"}},
    {id:6,brand_id:4,name:"Miami 1.0",category:"Sepeda",type:"Lipat",price:2900000,description:"Sepeda lipat ringkas untuk dibawa ke mana saja.",specs:{Rangka:"Baja",Roda:"20 inci",Transmisi:"6 speed",Rem:"V-brake"}},
    {id:7,brand_id:4,name:"Invert 2.0",category:"Sepeda",type:"MTB",price:3200000,description:"Sepeda gunung entry level untuk pemula.",specs:{Rangka:"Alumunium",Roda:"26 inci",Transmisi:"21 speed",Rem:"Cakram"}},
    {id:8,brand_id:5,name:"Urban E1",category:"Sepeda Listrik",type:"Urban",price:8900000,description:"Sepeda listrik harian dengan bantuan kayuh dan motor hub.",specs:{Motor:"350 W",Baterai:"36V 10Ah","Jarak tempuh":"40 km","Kecepatan maks":"25 km/jam"}},
    {id:9,brand_id:6,name:"Satria F150",category:"Motor",type:"Sport",price:27000000,description:"Underbone bertenaga dengan mesin DOHC.",specs:{Mesin:"147 cc",Tenaga:"16,3 PS",Berat:"109 kg",Tangki:"4 L"}}]
};
