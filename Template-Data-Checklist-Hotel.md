# Template Data + Checklist — Hotel / Resort (siap copy ke mock.ts)

| Field | Nilai |
|---|---|
| Versi | 1.0 |
| Terkait | `PRD-Hotel.md`, `API-Contract-Hotel.md` |
| Cara pakai | Copy blok `mock.ts` di §1 ke `lib/mock.ts`, centang §5 saat demo |

---

## 1. mock.ts — copy langsung

```ts
// lib/mock.ts — data dummy untuk demo tanpa backend
export const roomTypes = [
  { id: 'superior', nama: 'Superior Twin', kapasitas: 2, bed: 'Twin 120x200 x2', luas: '28m2',
    harga_weekday: 650000, harga_weekend: 800000,
    fasilitas: ['AC', 'TV 43"', 'WiFi', 'Air panas', 'Mini fridge'],
    foto: ['/images/superior-1.jpg'] },
  { id: 'deluxe', nama: 'Deluxe King', kapasitas: 2, bed: 'King 180x200', luas: '32m2',
    harga_weekday: 750000, harga_weekend: 950000,
    fasilitas: ['AC', 'TV 50"', 'WiFi', 'Balkon', 'Bathtub'],
    foto: ['/images/deluxe-1.jpg'] },
  { id: 'family', nama: 'Family Room', kapasitas: 4, bed: 'King + Single x2', luas: '45m2',
    harga_weekday: 1200000, harga_weekend: 1450000,
    fasilitas: ['AC', 'TV 50"', 'Sofa', 'Microwave', 'Balkon'],
    foto: ['/images/family-1.jpg'] },
  { id: 'suite', nama: 'Executive Suite', kapasitas: 3, bed: 'King + Sofa bed', luas: '60m2',
    harga_weekday: 1500000, harga_weekend: 1800000,
    fasilitas: ['Ruang tamu', 'Bathtub', 'Coffee maker', 'Smart TV', 'Lounge access'],
    foto: ['/images/suite-1.jpg'] },
  { id: 'villa', nama: 'Pool Villa', kapasitas: 4, bed: 'King x2', luas: '120m2',
    harga_weekday: 2500000, harga_weekend: 3200000,
    fasilitas: ['Private pool', 'Taman', 'Dapur', 'BBQ area', 'Carport'],
    foto: ['/images/villa-1.jpg'] },
];

export const rooms = [
  // Superior 101-110 (10 kamar, lantai 1)
  { id: 1, nomor: '101', room_type_id: 'superior', lantai: 1, status: 'vacant_clean' },
  { id: 2, nomor: '102', room_type_id: 'superior', lantai: 1, status: 'occupied_clean' },
  { id: 3, nomor: '103', room_type_id: 'superior', lantai: 1, status: 'vacant_clean' },
  { id: 4, nomor: '104', room_type_id: 'superior', lantai: 1, status: 'vacant_dirty' },
  { id: 5, nomor: '105', room_type_id: 'superior', lantai: 1, status: 'vacant_clean' },
  { id: 6, nomor: '106', room_type_id: 'superior', lantai: 1, status: 'occupied_dirty' },
  { id: 7, nomor: '107', room_type_id: 'superior', lantai: 1, status: 'vacant_clean' },
  { id: 8, nomor: '108', room_type_id: 'superior', lantai: 1, status: 'out_of_order' },
  { id: 9, nomor: '109', room_type_id: 'superior', lantai: 1, status: 'vacant_clean' },
  { id: 10, nomor: '110', room_type_id: 'superior', lantai: 1, status: 'vacant_clean' },
  // Deluxe 201-210 (10 kamar, lantai 2)
  { id: 11, nomor: '201', room_type_id: 'deluxe', lantai: 2, status: 'vacant_clean' },
  { id: 12, nomor: '202', room_type_id: 'deluxe', lantai: 2, status: 'occupied_clean' },
  { id: 13, nomor: '203', room_type_id: 'deluxe', lantai: 2, status: 'vacant_dirty' },
  { id: 14, nomor: '204', room_type_id: 'deluxe', lantai: 2, status: 'vacant_clean' },
  { id: 15, nomor: '205', room_type_id: 'deluxe', lantai: 2, status: 'vacant_clean' },
  { id: 16, nomor: '206', room_type_id: 'deluxe', lantai: 2, status: 'maintenance' },
  { id: 17, nomor: '207', room_type_id: 'deluxe', lantai: 2, status: 'vacant_clean' },
  { id: 18, nomor: '208', room_type_id: 'deluxe', lantai: 2, status: 'occupied_clean' },
  { id: 19, nomor: '209', room_type_id: 'deluxe', lantai: 2, status: 'vacant_clean' },
  { id: 20, nomor: '210', room_type_id: 'deluxe', lantai: 2, status: 'vacant_clean' },
  // Family 301-305, Suite 401-403, Villa A1-A2
  { id: 21, nomor: '301', room_type_id: 'family', lantai: 3, status: 'vacant_clean' },
  { id: 22, nomor: '302', room_type_id: 'family', lantai: 3, status: 'occupied_clean' },
  { id: 23, nomor: '303', room_type_id: 'family', lantai: 3, status: 'vacant_dirty' },
  { id: 24, nomor: '304', room_type_id: 'family', lantai: 3, status: 'vacant_clean' },
  { id: 25, nomor: '305', room_type_id: 'family', lantai: 3, status: 'vacant_clean' },
  { id: 26, nomor: '401', room_type_id: 'suite', lantai: 4, status: 'vacant_clean' },
  { id: 27, nomor: '402', room_type_id: 'suite', lantai: 4, status: 'occupied_clean' },
  { id: 28, nomor: '403', room_type_id: 'suite', lantai: 4, status: 'vacant_clean' },
  { id: 29, nomor: 'A1', room_type_id: 'villa', lantai: 1, status: 'vacant_clean' },
  { id: 30, nomor: 'A2', room_type_id: 'villa', lantai: 1, status: 'vacant_clean' },
];

export const guests = [
  { id: 1, nama: 'Budi Santoso', nik: '3271010101900001', no_hp: '081212345601', email: 'budi@mail.com' },
  { id: 2, nama: 'Siti Aminah', nik: '3271010202900002', no_hp: '081212345602', email: 'siti@mail.com' },
  { id: 3, nama: 'Andi Wijaya', nik: '3271010303900003', no_hp: '081212345603', email: 'andi@mail.com' },
  { id: 4, nama: 'Dewi Lestari', nik: '3271010404900004', no_hp: '081212345604', email: 'dewi@mail.com' },
  { id: 5, nama: 'Rina Marlina', nik: '3271010505900005', no_hp: '081212345605', email: 'rina@mail.com' },
  { id: 6, nama: 'Agus Walk-in', nik: '3271010606900006', no_hp: '081212345606', email: '' },
  { id: 7, nama: 'PT Maju Jaya (Meeting)', nik: '-', no_hp: '0215550101', email: 'ga@majujaya.com' },
  { id: 8, nama: 'John Smith (OTA)', nik: 'P123456', no_hp: '+6281212345608', email: 'john@mail.com' },
  { id: 9, nama: 'Keluarga Harto', nik: '3271010909900009', no_hp: '081212345609', email: 'harto@mail.com' },
  { id: 10, nama: 'No Show Contoh', nik: '3271011010900010', no_hp: '081212345610', email: '' },
];

export const reservations = [
  { id: 101, kode: 'HTL-2026-0001', guest_id: 1, check_in: '2026-10-10', check_out: '2026-10-12', status: 'confirmed', sumber: 'direct', kamar: [{ room_type_id: 'deluxe', qty: 1 }] },
  { id: 102, kode: 'HTL-2026-0002', guest_id: 2, check_in: '2026-10-10', check_out: '2026-10-11', status: 'checked_in', sumber: 'walkin', kamar: [{ room_type_id: 'superior', qty: 1 }], room_id: 2 },
  { id: 103, kode: 'HTL-2026-0003', guest_id: 3, check_in: '2026-10-09', check_out: '2026-10-10', status: 'checked_in', sumber: 'direct', kamar: [{ room_type_id: 'deluxe', qty: 1 }], room_id: 18 },
  { id: 104, kode: 'HTL-2026-0004', guest_id: 8, check_in: '2026-10-10', check_out: '2026-10-13', status: 'confirmed', sumber: 'ota', kamar: [{ room_type_id: 'villa', qty: 1 }] },
  { id: 105, kode: 'HTL-2026-0005', guest_id: 10, check_in: '2026-10-08', check_out: '2026-10-09', status: 'no_show', sumber: 'direct', kamar: [{ room_type_id: 'superior', qty: 1 }] },
];

export const services = [
  { id: 'resto-nasgor', nama: 'Resto - Nasi Goreng Special', harga: 45000, satuan: 'porsi' },
  { id: 'resto-ayambakar', nama: 'Resto - Ayam Bakar + Nasi', harga: 55000, satuan: 'porsi' },
  { id: 'laundry-kilo', nama: 'Laundry Kiloan', harga: 20000, satuan: 'kg' },
  { id: 'laundry-satuan', nama: 'Laundry Satuan (kemeja)', harga: 15000, satuan: 'pcs' },
  { id: 'minibar-aqua', nama: 'Minibar - Aqua 600ml', harga: 15000, satuan: 'btl' },
  { id: 'meeting-half', nama: 'Meeting Room Half Day', harga: 1500000, satuan: 'paket' },
  { id: 'extrabed', nama: 'Extra Bed', harga: 200000, satuan: 'malam' },
  { id: 'late-checkout', nama: 'Late Checkout (sd 15:00)', harga: 150000, satuan: 'kali' },
];

export const users = [
  { id: 1, nama: 'Owner', email: 'owner@hotel.com', role: 'owner' },
  { id: 2, nama: 'Resepsionis 1', email: 'fo1@hotel.com', role: 'resepsionis' },
  { id: 3, nama: 'Kasir 1', email: 'kasir@hotel.com', role: 'kasir' },
  { id: 4, nama: 'OB Andi', email: 'ob1@hotel.com', role: 'housekeeping' },
];

export const settings = {
  pajak_pct: 11, service_pct: 5,
  jam_checkin: '14:00', jam_checkout: '12:00',
  dp_min_pct: 30,
};
```

---

## 2. Cara hitung harga (biar sama semua)

```
jumlah_malam = checkout - checkin (contoh 10-12 = 2)
harga_per_malam = weekend? harga_weekend : harga_weekday
  weekend = Jumat, Sabtu, Minggu (bisa ubah di settings)
subtotal = harga_per_malam x malam x qty
pajak = subtotal x 11%
total = subtotal + pajak
dp_min = total x 30%
```

Contoh: Deluxe 750rb x 2 = 1.500.000 + pajak 165.000 = 1.665.000, DP min 499.500 -> bulatkan 500.000.

---

## 3. Skenario demo (untuk video / presentasi owner)

| # | Skenario | Data pakai | Hasil harap |
|---|---|---|---|
| D1 | Tamu booking Deluxe 10-12 Okt | Budi, Deluxe x1 | Kode HTL-2026-0001, sisa 3 kamar Deluxe di tanggal itu |
| D2 | Walk-in Superior hari ini | Agus, Superior, room 101 | Langsung checked_in, 101 jadi occupied |
| D3 | Checkout + kotor + bersih | Andi di 208 checkout | 208 jadi vacant_dirty + task todo, OB selesaikan -> vacant_clean |
| D4 | Tambah resto + bayar | Folio 101 + 2 nasgor | Total +90rb + pajak, sisa berkurang setelah bayar |
| D5 | Kamar rusak | Set 108 out_of_order | Tidak muncul di availability & room picker |

---

## 4. Aset gambar (sementara)

Selama belum ada foto asli, pakai placeholder:
- `/images/superior-1.jpg` -> Unsplash hotel room
- Atau `https://picsum.photos/seed/deluxe/800/600`

Jangan pakai gambar Google tanpa lisensi untuk demo owner.

---

## 5. Checklist kelengkapan data (centang sebelum coding M1)

- [ ] 5 tipe kamar ada harga weekday/weekend + kapasitas
- [ ] 30 kamar ada nomor + status awal bervariasi (jangan semua clean)
- [ ] Minimal 1 contoh tiap status reservasi: pending, confirmed, checked_in, checked_out, cancelled, no_show
- [ ] Minimal 1 folio dengan service + pajak + DP sebagian
- [ ] Minimal 3 task housekeeping: todo, progress, done
- [ ] User tiap role ada 1 (owner, fo, kasir, OB)
- [ ] Settings pajak & jam sudah diisi

---

*File ini + mock.ts di atas cukup untuk jalan M0-M1 tanpa backend.*
