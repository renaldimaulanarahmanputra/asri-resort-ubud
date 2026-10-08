# PRD — Sistem Hotel Menengah / Resort (Frontend Focus v1)

| Field | Nilai |
|---|---|
| Versi | 1.0 |
| Status | Draft untuk eksekusi frontend |
| Tipe hotel | Menengah / Resort, 100+ kamar, + Resto + Meeting Room |
| Platform target | Web responsif (Desktop admin + Mobile tamu & OB) |
| Bahasa UI | Indonesia |
| Tech rekomendasi | Next.js + TypeScript + Tailwind + PostgreSQL (via API) |
| Terakhir diperbarui | 2026-10-07 |

---

## 1. Ringkasan Produk

**Apa ini?** Web sistem hotel 2 sisi:

1. **Sisi Tamu (Public):** cari kamar, booking online, bayar DP, terima e-voucher.
2. **Sisi Staff (Admin):** dashboard harian untuk resepsionis, kasir, housekeeping, owner.

**Masalah yang diselesaikan:**
- Booking masih via WA/telepon, tidak ada ketersediaan real-time → double booking.
- Check-in lama karena data tamu + kamar + tagihan terpisah.
- Status kamar (bersih/kotor) tidak terpantau → kamar siap jual telat.
- Owner tidak tahu okupansi & revenue harian secara real-time.

**Target user:**
- Tamu (booking via HP)
- Resepsionis / Front Office
- Kasir / Finance
- Housekeeping / OB (pakai HP)
- Owner / Manager (lihat laporan)

---

## 2. Sasaran & Indikator Keberhasilan

| # | Sasaran | Metrik |
|---|---|---|
| G1 | Booking online jalan | Tamu bisa cari -> bayar DP < 3 menit, tanpa bantuan admin |
| G2 | Check-in cepat | Resepsionis check-in walk-in / arrival < 2 menit |
| G3 | Tidak ada kamar kotor terjual | 100% kamar `vacant_dirty` tidak bisa dibooking |
| G4 | Tagihan akurat | Selisih folio vs pembayaran = 0, ada invoice PDF |
| G5 | Frontend responsif | Semua halaman lolos HP 360px + desktop 1280px, loading < 2s |
| G6 | Owner paham bisnis | Dashboard tampilkan Okupansi %, ADR, RevPAR harian |

---

## 3. Scope

### 3.1 In scope (v1 - wajib jadi)

- Katalog kamar + pencarian ketersediaan berdasarkan tanggal
- Booking + kode booking `HTL-2026-0001` + e-voucher
- Dashboard front-office: Arrival / In-House / Departure / Kotor hari ini
- Check-in (assign kamar), pindah kamar, extend, check-out
- Folio (tagihan gabungan): kamar + pajak 11% + service + resto/laundry
- Pembayaran: DP + pelunasan, metode cash/transfer/QRIS (dummy dulu, Midtrans nanti)
- Housekeeping board: Todo -> Progress -> Done, update via HP
- Laporan sederhana: okupansi, revenue harian, per tipe kamar
- Login + role: `owner, resepsionis, kasir, housekeeping, tamu`

### 3.2 Out of scope (v1 - jangan kerjakan dulu)

- Channel manager OTA (Traveloka/Tiket.com sinkron otomatis)
- Multi-cabang / multi-hotel
- POS resto penuh, inventory gudang
- Key card / door lock integrasi
- Loyalty point / membership kompleks
- Aplikasi native Android/iOS (cukup web responsif)

---

## 4. Arsitektur Frontend (kesepakatan kita berdua)

### 4.1 Pilihan stack

| Opsi | Deskripsi | Rekomendasi |
|---|---|---|
| **A (utama)** | **Next.js App Router + TypeScript + Tailwind + shadcn/ui** | **Direkomendasikan** — SEO booking bagus, 1 repo untuk tamu + admin |
| B | React Vite + Tailwind | Boleh kalau kamu lebih nyaman SPA, tapi butuh backend terpisah |
| C | HTML + Bootstrap | Cepat, tapi susah scale untuk dashboard kompleks |

**Keputusan:** Opsi A. Semua fetch via `lib/api.ts` ke REST API, pakai data dummy dulu biar bisa jalan tanpa backend.

### 4.2 Aturan main frontend (biar kompak)

1. Semua tanggal pakai `YYYY-MM-DD`, tampilkan `07 Okt 2026` via helper.
2. Semua uang pakai number (Rupiah), format via `formatRupiah()`.
3. Status hanya boleh nilai ini (jangan bikin string bebas):

```ts
type RoomStatus = 'vacant_clean' | 'vacant_dirty' | 'occupied_clean' | 'occupied_dirty' | 'out_of_order' | 'maintenance';
type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
type TaskStatus = 'todo' | 'progress' | 'done';
```

4. Setiap halaman list wajib punya: loading skeleton, empty state, error state.
5. Form booking wajib validasi: tanggal out > tanggal in, jumlah tamu <= kapasitas.

### 4.3 Struktur folder (standar kita)

```
hotel-web/
  app/
    (public)/
      page.tsx              # homepage + SearchWidget
      rooms/page.tsx        # list hasil pencarian
      rooms/[id]/page.tsx   # detail kamar
      booking/page.tsx      # form data tamu
      payment/page.tsx      # bayar DP
      my-booking/[kode]/page.tsx # e-voucher
    (admin)/
      layout.tsx            # sidebar + guard role
      dashboard/page.tsx
      reservations/page.tsx
      front-office/page.tsx
      folio/[id]/page.tsx
      housekeeping/page.tsx
      reports/page.tsx
  components/
    booking/SearchWidget.tsx, RoomCard.tsx, BookingForm.tsx
    admin/RoomStatusBoard.tsx, FolioTable.tsx, PaymentModal.tsx, StatCard.tsx
  lib/
    api.ts                  # fetch API, gampang ganti ke backend asli
    mock.ts                 # data dummy 5 tipe kamar + 30 kamar
    types.ts                # tipe Room, Reservation, Folio
    utils.ts                # formatRupiah, formatTanggal, hitungMalam
```

---

## 5. Fitur Detail (acuan slicing)

### F1 — Reservasi & Booking Online (sisi tamu)

**Alur:**
1. Home: input check-in, check-out, dewasa, anak -> Klik Cari
2. List: tampilkan tipe kamar yang tersedia + harga total (harga/malam x malam) + sisa kamar
3. Detail: foto, fasilitas, kapasitas, kebijakan (check-in 14:00, check-out 12:00)
4. Form tamu: nama, NIK, no HP/WA, email, request khusus
5. Bayar DP (frontend: pilih metode, upload bukti / simulasi sukses)
6. Sukses: tampilkan kode booking + tombol WA + unduh voucher

**Acceptance:**
- Given tanggal 10-12 Okt (2 malam), when pilih Deluxe 750rb/malam, then total = 1.500.000 + pajak tampil jelas.
- Given kamar habis / `vacant_dirty`, when cari tanggal itu, then tidak muncul di list.
- Given form HP kosong, when klik lanjut, then error "No HP wajib".

### F2 — Front Office (sisi resepsionis)

**UI:** `Dashboard Hari Ini` 4 kartu + tabel:
- Arrival Hari Ini (confirmed, check_in = hari ini)
- In-House (checked_in)
- Departure Hari Ini (check_out = hari ini)
- Kamar Kotor (vacant_dirty + occupied_dirty)

**Aksi:**
- Check-in: pilih arrival -> modal assign kamar fisik (hanya tampilkan yang `vacant_clean` + tipe cocok) -> input deposit -> status jadi `checked_in`, kamar jadi `occupied_clean`
- Pindah kamar / Extend: modal ganti kamar / tambah malam, folio otomatis nambah
- Check-out: cek folio lunas -> tombol checkout -> reservasi `checked_out`, kamar jadi `vacant_dirty` + auto buat housekeeping task

**Acceptance:**
- Check-in tanpa assign kamar fisik tidak bisa disimpan.
- Kamar `out_of_order` tidak pernah muncul di pilihan assign.

### F3 — Folio & Pembayaran (sisi kasir)

**UI:** 1 folio per reservasi.
- Header: kode booking, tamu, periode, kamar
- Tabel items: tanggal | deskripsi | qty | harga | total
- Footer: subtotal kamar + service + pajak 11% - diskon = grand total - sudah bayar = sisa
- Tombol: Tambah charge (resto/laundry), Bayar, Cetak invoice PDF

**Acceptance:**
- Tambah resto 200rb -> grand total + sisa bertambah 200rb + pajak jika kena.
- Bayar melebihi sisa -> tolak dengan pesan.
- Folio belum lunas -> tombol check-out terkunci.

### F4 — Housekeeping (sisi OB, mobile first)

**UI:** Board 3 kolom ala kanban, kartu besar gampang dipencet jempol:
`Perlu Dibersihkan (todo) | Sedang Dikerjakan (progress) | Selesai (done)`

**Alur:**
1. Sistem auto buat task saat checkout.
2. OB klik Ambil -> `progress`
3. OB klik Selesai + foto (opsional) -> `done` -> kamar otomatis `vacant_clean`

**Acceptance:**
- Update status kamar hanya lewat task, tidak edit manual.
- Tampilan 360px tanpa scroll horizontal.

### F5 — Laporan & Dashboard (sisi owner)

**UI:** Filter tanggal + 4 kartu + 2 grafik:
- Okupansi % = kamar terjual / total kamar aktif
- ADR = revenue kamar / kamar terjual
- RevPAR = revenue kamar / total kamar
- Total revenue (kamar + service)

Tabel: revenue per tipe kamar, per channel (direct/OTA/walk-in).

**Acceptance:**
- Ganti filter tanggal -> semua angka & grafik berubah.
- Angka di dashboard = jumlah dari tabel folio (tidak hardcode).

---

## 6. Kebutuhan Non-Fungsional (frontend)

| Area | Kebutuhan |
|---|---|
| Performa | List kamar < 2s, dashboard < 2s, image kamar pakai lazy + compress |
| Validasi | Semua form ada pesan Indonesia jelas, cegah double submit |
| Auth | Guard route: tamu tidak bisa buka /dashboard, OB hanya /housekeeping |
| Offline-ish | Kalau API mati, tampilkan error cantik + tombol coba lagi, jangan blank putih |
| Aksesibilitas | Kontras cukup, tombol min 44px untuk OB |
| Data dummy | `lib/mock.ts` wajib ada 5 tipe + 30 kamar biar bisa demo tanpa backend |

---

## 7. API Contract yang Kita Butuhkan (biar backend gampang)

Frontend tidak nunggu backend, pakai mock dulu dengan bentuk ini:

```
GET  /api/availability?check_in=2026-10-10&check_out=2026-10-12&guest=2
POST /api/reservations {guest, check_in, check_out, items:[{room_type_id, qty}]}
GET  /api/reservations?date=2026-10-10&status=confirmed
POST /api/reservations/:id/checkin {room_id, deposit}
POST /api/reservations/:id/checkout
GET  /api/folios/:reservation_id
POST /api/folios/:id/items {deskripsi, qty, harga}
POST /api/folios/:id/payments {metode, jumlah}
GET  /api/housekeeping?status=todo
PATCH /api/housekeeping/:id {status}
GET  /api/reports/daily?from=2026-10-01&to=2026-10-07
```

Semua response: `{ success: true, data: ..., message: ... }`

---

## 8. Milestone Eksekusi (urutan kita berdua)

| Milestone | Isi | Keluaran |
|---|---|---|
| **M0** | Setup Next.js + Tailwind + `types.ts` + `mock.ts` + layout public/admin | Proyek jalan, bisa demo data dummy |
| **M1** | F1 Booking tamu (search -> list -> detail -> form -> sukses) | Tamu bisa pura-pura booking sampai dapat kode |
| **M2** | F2 Front Office dashboard + check-in/out modal | Resepsionis bisa proses arrival -> in-house -> departure |
| **M3** | F3 Folio + pembayaran + cetak | Tagihan akurat, tidak bisa checkout kalau belum lunas |
| **M4** | F4 Housekeeping board mobile | OB bisa update via HP, kamar otomatis bersih |
| **M5** | F5 Laporan + polish + UAT | Owner lihat okupansi & revenue, siap demo v1 |

---

## 9. Risiko & Mitigasi (khusus frontend)

| Risiko | Mitigasi |
|---|---|
| Double booking karena ketersediaan tidak real-time | Selalu hitung sisa = total - terbooking di tanggal itu, kunci tombol jika 0 |
| Tanggal ngaco (checkout < checkin) | Date picker min = hari ini, checkout min = checkin+1, validasi ganda |
| Nominal rupiah beda format | Satu helper `formatRupiah()` dipakai semua halaman |
| OB gaptek / HP kentang | Tombol besar, 1 aksi 1 klik, tanpa modal berlapis |
| Backend belum jadi | `lib/api.ts` baca switch `USE_MOCK=true`, ganti false kalau API asli siap |

---

## 10. Open Questions (jawab sebelum M1)

1. Tarif beda weekday/weekend/high season? Atau 1 harga flat dulu?
2. Pajak 11% + service 5%? Atau digabung? Perlu tampil di invoice?
3. DP minimal berapa %? 50%? Atau 1 malam?
4. Check-in/out jam berapa? 14:00 / 12:00? Ada biaya early/late?
5. Meeting room & villa dihitung per kamar juga atau modul sewa terpisah?
6. Metode bayar v1: transfer manual + QRIS dummy dulu, atau langsung Midtrans?

---

## 11. Lampiran — Contoh data dummy (isi `mock.ts`)

```ts
room_types = [
  { id: 'deluxe', nama: 'Deluxe King', kapasitas: 2, harga_weekday: 750000, harga_weekend: 950000 },
  { id: 'twin', nama: 'Superior Twin', kapasitas: 2, harga_weekday: 650000, harga_weekend: 800000 },
  { id: 'suite', nama: 'Executive Suite', kapasitas: 3, harga_weekday: 1500000, harga_weekend: 1800000 },
  { id: 'villa', nama: 'Pool Villa', kapasitas: 4, harga_weekday: 2500000, harga_weekend: 3200000 },
];

rooms = [
  { id: 1, nomor: '101', room_type_id: 'deluxe', status: 'vacant_clean' },
  { id: 2, nomor: '102', room_type_id: 'deluxe', status: 'occupied_clean' },
  { id: 3, nomor: '201', room_type_id: 'suite', status: 'vacant_dirty' },
  // ... total 30
];

reservation contoh:
kode: HTL-2026-0001, tamu: Budi, 10-12 Okt, Deluxe x1, total 1.500.000 + pajak 165.000 = 1.665.000, DP 500.000, sisa 1.165.000
```

---

*Selesai. File ini jadi acuan kita berdua. Langkah berikutnya: buat `Sitemap-UserFlow-Hotel.md` + `API-Contract-Hotel.md` biar kamu bisa langsung slicing pakai mock.*
