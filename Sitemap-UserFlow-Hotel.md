# Sitemap + User Flow — Sistem Hotel / Resort (Frontend)

| Field | Nilai |
|---|---|
| Versi | 1.0 |
| Terkait PRD | `PRD-Hotel.md` v1.0 |
| Fokus | Alur klik per halaman, biar slicing tidak nyasar |
| Prinsip | 1 alur = max 5 klik dari home/dashboard sampai sukses |

---

## 1. Sitemap (Peta Halaman)

```
/ (homepage + SearchWidget)
  /rooms?check_in=..&check_out=..&dewasa=2       # hasil pencarian
  /rooms/[id]                                    # detail tipe kamar
  /booking?room_type=deluxe&check_in=..          # form data tamu
  /payment?kode=HTL-2026-0001                    # bayar DP
  /my-booking/[kode]                             # e-voucher + status
  /login                 # 1 pintu untuk tamu + staff (tanpa pilihan role, tanpa hint staff)
  /register              # selalu bikin role=tamu, tidak bisa daftar jadi staff (no approve flow)
  /lupa-password         # reset via email

/ (admin, layout sidebar + guard role)
  /dashboard            # owner + resepsionis: arrival/in-house/departure/kotor
  /reservations         # list semua booking + filter tanggal/status
  /reservations/[id]    # detail 1 booking + timeline
  /front-office         # check-in/out cepat (kasir + resepsionis)
  /folio/[id]           # tagihan + tambah charge + bayar + cetak
  /housekeeping         # board todo/progress/done (OB + resepsionis)
  /reports              # okupansi, ADR, RevPAR, revenue (owner)
  /master/rooms         # CRUD kamar (owner/admin)
  /master/room-types    # CRUD tipe + harga weekday/weekend
  /master/users         # owner saja: Tambah Staff (nama+email+role+password awal), Upgrade email Google jadi staff, Reset password. TIDAK ada approve.
  /settings             # pajak, jam check-in/out, kebijakan DP
```

**Aturan akun (disepakati, tanpa approve):**
- Publik daftar → selalu `tamu`. Tidak ada cara naik jadi staff dari halaman publik.
- Staff hanya dari owner input di `/master/users` atau owner upgrade email Google yang sudah login sekali.
- Login diam-diam: `profiles.role` → tamu ke `/`, staff ke `/dashboard` sesuai role. Tidak ada tombol "login sebagai".

**File route Next.js-nya (biar langsung bisa bikin folder):**

```
app/(public)/page.tsx
app/(public)/rooms/page.tsx
app/(public)/rooms/[id]/page.tsx
app/(public)/booking/page.tsx
app/(public)/payment/page.tsx
app/(public)/my-booking/[kode]/page.tsx
app/(admin)/dashboard/page.tsx
app/(admin)/reservations/page.tsx
app/(admin)/reservations/[id]/page.tsx
app/(admin)/front-office/page.tsx
app/(admin)/folio/[id]/page.tsx
app/(admin)/housekeeping/page.tsx
app/(admin)/reports/page.tsx
```

---

## 2. User Flow per Role (versi gampang)

### 2.1 Tamu — Booking sampai dapat voucher (HP)

```
[Home]
  isi: check_in=10 Okt, check_out=12 Okt, dewasa=2
  klik [Cari Kamar]
    |
    v
[List /rooms] — tampil: foto, nama tipe, kapasitas, harga total 2 malam + pajak, sisa X kamar, tombol [Pilih]
  klik [Pilih Deluxe]
    |
    v
[Detail /rooms/deluxe] — foto besar, fasilitas, kebijakan, review
  klik [Pesan Sekarang]
    |
    v
[Form /booking] — nama, NIK, HP, email, request (extra bed / lantai atas)
  validasi: HP wajib, tanggal valid
  klik [Lanjut ke Pembayaran]
    |
    v
[Bayar /payment] — rincian: 750rb x 2 = 1.500.000 + pajak 165.000 = 1.665.000, DP min 500rb, pilih metode [Transfer/QRIS]
  klik [Bayar DP] -> simulasi sukses
    |
    v
[Sukses /my-booking/HTL-2026-0001] — kode booking besar, tombol [Kirim ke WA] [Unduh Voucher] [Lihat Status]
```

Empty/error:
- Tanggal kosong -> tahan di Home + pesan merah.
- Tidak ada kamar tersedia -> ilustrasi + tombol [Ganti Tanggal].
- Bayar gagal -> tetap di /payment + tombol [Coba Lagi], booking status `pending`.

### 2.2 Resepsionis — Sehari-hari (Desktop)

```
Login -> [Dashboard]
  Lihat 4 kartu: Arrival 10 | In-House 45 | Departure 8 | Kotor 12
  |
  +-- Klik Arrival -> tabel arrival hari ini -> klik 1 baris [HTL-2026-0001 Budi]
  |     -> [Detail Reservasi] -> klik [Check-In]
  |     -> Modal: pilih kamar fisik [dropdown hanya vacant_clean tipe Deluxe: 101, 102...] + deposit 200rb + [Konfirmasi]
  |     -> sukses: toast "Budi check-in kamar 101", pindah ke tab In-House
  |
  +-- Klik Departure -> pilih tamu mau pulang -> [Lihat Folio]
        -> [Folio] cek sisa 0? kalau >0 -> [Terima Pelunasan] dulu
        -> klik [Check-Out] -> kamar jadi vacant_dirty + task OB muncul
```

Aksi cepat di `/front-office`:
- Walk-in: [Buat Booking Langsung] -> isi tanggal = hari ini -> langsung check-in.
- Pindah kamar: [Pindah] -> pilih kamar pengganti vacant_clean -> folio tidak berubah, hanya room_id ganti.
- Extend: [Perpanjang 1 malam] -> folio nambah otomatis 750rb + pajak.

### 2.3 Kasir — Folio & Uang (Desktop)

```
[Detail Reservasi] -> [Lihat Folio /folio/1]
  Tabel items + footer total
  |
  +-- [Tambah Charge] -> modal: pilih service [Resto Nasi Goreng 45rb / Laundry 20rb] + qty -> masuk tabel
  +-- [Bayar] -> modal: metode + jumlah + referensi -> sisa berkurang
  |     aturan: jumlah <= sisa, jumlah >0
  +-- [Cetak Invoice] -> buka PDF preview -> print
```

Guard:
- Sisa > 0 -> tombol [Check-Out] disabled + tooltip "Lunasi dulu Rp1.165.000".
- Bayar lebih dari sisa -> tolak: "Maks Rp1.165.000".

### 2.4 OB / Housekeeping — Via HP (Mobile first)

```
Login (role housekeeping) langsung ke [/housekeeping]
Board 3 kolom (di HP jadi 1 kolom + tab):
[Perlu Dibersihkan 12] | [Dikerjakan 2] | [Selesai 30]

Klik kartu Kamar 201 Checkout-clean [Ambil] -> pindah ke Dikerjakan
  -> datang, bersihkan -> klik [Selesai] (+ foto opsional)
  -> kamar 201 otomatis vacant_clean -> hilang dari board, masuk list Siap Jual
```

Aturan:
- OB tidak bisa edit harga / folio.
- 1 task hanya bisa diambil 1 orang (tampilkan nama pengambil).

### 2.5 Owner — Lihat Bisnis (Desktop + HP)

```
[/reports] filter: 1-7 Okt 2026
  4 kartu: Okupansi 72% | ADR 850rb | RevPAR 612rb | Revenue 45jt
  Grafik garis revenue harian + bar per tipe kamar
  Tabel: Deluxe 20 terjual 15jt | Suite 5 terjual 7,5jt ...
```

---

## 3. Daftar Halaman + Komponen (buat bagi tugas kita)

| Halaman | Komponen utama | State penting | Keterangan frontend |
|---|---|---|---|
| Home `/` | `SearchWidget`, `RoomTypeHighlight`, `FacilityGrid` | check_in, check_out, guest | Date picker min hari ini |
| List `/rooms` | `RoomCard`, `FilterBar`, `SortDropdown` | list, filter harga/kapasitas | Skeleton saat loading |
| Detail `/rooms/[id]` | `ImageGallery`, `PriceBox`, `PolicyList` | qty, total | Hitung total = harga x malam |
| Booking `/booking` | `BookingForm`, `OrderSummary` | form tamu, errors | Validasi HP Indonesia |
| Payment `/payment` | `FolioSummary`, `PaymentMethod`, `UploadBukti` | metode, bukti, status | Disable double klik bayar |
| Voucher `/my-booking/[kode]` | `VoucherCard`, `StatusTimeline` | booking | Tombol WA share |
| Dashboard | `StatCard x4`, `ArrivalTable`, `DepartureTable`, `DirtyList` | date=today | Auto refresh 60 detik |
| Reservations | `ReservationTable`, `FilterStatus` | q, status, date | Search by kode/nama |
| Front-office | `CheckinModal`, `CheckoutModal`, `RoomPicker` | selected reservation | RoomPicker hanya vacant_clean |
| Folio | `FolioTable`, `AddChargeModal`, `PaymentModal` | folio, sisa | Kunci checkout jika sisa>0 |
| Housekeeping | `TaskBoard`, `TaskCard` | tasks by status | Mobile: tombol 44px+ |
| Reports | `StatCard`, `RevenueChart`, `TypeTable` | from, to | Chart pakai Recharts |

---

## 4. Navigasi & Guard Role (jangan sampai bocor)

```
Tamu (belum login) bisa: /, /rooms, /booking, /payment, /my-booking
Wajib login:
  resepsionis: dashboard, reservations, front-office, folio (lihat), housekeeping (lihat)
  kasir: dashboard, folio, reservations (lihat), reports (lihat)
  housekeeping: /housekeeping saja (+ /login)
  owner: semua + /reports + /master + /settings

Kalau buka halaman tanpa hak -> redirect /login + toast "Tidak punya akses".
Sidebar beda per role (OB tidak lihat menu Finance).
```

---

## 5. Checklist Slicing per Halaman (tempel di PR saat coding)

Setiap halaman wajib lolos ini sebelum dibilang done:

- [ ] Loading: ada skeleton, bukan blank putih
- [ ] Kosong: ada ilustrasi + CTA (mis. tidak ada arrival hari ini)
- [ ] Error: ada pesan + [Coba Lagi]
- [ ] HP 360px: tidak ada scroll horizontal, tombol gampang dipencet
- [ ] Validasi: form salah ada pesan Indonesia jelas
- [ ] Uang/tanggal: pakai `formatRupiah()` + `formatTanggal()` dari `lib/utils.ts`
- [ ] Status: pakai konstanta dari `lib/types.ts`, jangan string bebas

---

*Next: `API-Contract-Hotel.md` — bentuk JSON persis yang dipakai semua halaman di atas, biar bisa pakai mock dulu.*
