# Wireframe — Hotel / Resort (sketsa tiap halaman)

| Field | Nilai |
|---|---|
| Versi | 1.0 |
| Terkait | `Sitemap-UserFlow-Hotel.md`, `SRS-Frontend-Hotel.md` |
| Cara baca | Kotak `[ ]` = tombol, `( )` = input, `~~~` = gambar. Mobile = 360px, Desktop = 1280px. |

---

## W1. Home Public (Mobile + Desktop)

```
+--------------------------------------------------+
| LOGO Hotel Asri   [Lihat Booking] [Masuk]        |
+--------------------------------------------------+
|  Selamat datang di Resort Kami                   |
|  (check-in: 10 Okt) (check-out: 12 Okt)          |
|  (dewasa: 2 v) (anak: 0 v)  [ Cari Kamar ]       |
+--------------------------------------------------+
| Tipe Unggulan                                    |
| [~~~Deluxe 750rb] [~~~Suite 1,5jt] [~~~Villa]    |
+--------------------------------------------------+
| Fasilitas: Kolam | Resto | Meeting | Spa          |
+--------------------------------------------------+
```
Catatan: SearchWidget selalu di atas, sticky di HP. Tombol Cari disabled sampai tanggal valid.

## W2. List /rooms (hasil cari 10-12 Okt, 2 malam)

```
Filter: [Semua] [<=1jt] [Kapasitas 4]  Urut: [Termurah v]
+--------------------------------------------------+
| ~~~ | Deluxe King, 2 tamu, 32m2                 |
|     | Rp750rb x2 = Rp1,5jt + pajak => Rp1.665.000|
|     | Sisa 4 kamar        [ Pilih ]              |
+--------------------------------------------------+
| ~~~ | Family Room ... Sisa 0 -> [ Habis ] mati   |
+--------------------------------------------------+
```
Skeleton saat loading: 3 kotak abu berkedip. Kosong: ilustrasi + [Ganti Tanggal].

## W3. Detail /rooms/deluxe

```
[< Kembali]   Deluxe King          [Pesan Sekarang*]
[~~~ besar] [~~~ kecil] [~~~ kecil]
Harga: Rp750rb/malam (weekday) / Rp950rb (weekend)
Fasilitas: checklist AC, Balkon, Bathtub...
Kebijakan: Check-in 14:00, Check-out 12:00, DP 30%
Hitung: (qty: 1) x 2 malam = Rp1.665.000
*sticky di HP bawah layar
```

## W4. Booking Form + Payment

```
Form Tamu          | Ringkasan (kanan desktop, bawah di HP)
(nama: Budi)       | Deluxe x1, 10-12 Okt (2 malam)
(HP: 0812...)      | 750rb x2 = 1.500.000
(NIK: 3271...)     | Pajak 11% = 165.000
(request: .....)   | Total = 1.665.000, DP min 500rb
[ Lanjut Bayar ]   |

Payment:
Metode: (o) Transfer (o) QRIS ( ) Cash
[ Bayar DP Rp500.000 ] -> sukses:
[Kode besar HTL-2026-0001] [Kirim WA] [Unduh]
```

## W5. Dashboard Admin (Desktop)

```
Sidebar: Dashboard Reservasi FrontOffice Folio Housekeeping Reports
+--------------------------------------------------+
| Hari ini: (10 Okt 2026) [refresh 60s]            |
| [Arrival 10] [In-House 45] [Departure 8] [Kotor12]|
+--------------------------------------------------+
| Arrival hari ini              [Walk-in +]        |
| Kode | Tamu | Tipe | Malam | Aksi               |
| HTL1 | Budi | Dlx  | 2     | [Check-In] [Detail]|
+--------------------------------------------------+
| Perlu dibersihkan: 201, 203, 303 [Lihat]         |
+--------------------------------------------------+
Modal Check-In:
  Pilih kamar: (201 v) hanya vacant_clean
  (deposit: 200000) [Batal] [Konfirmasi]
```

## W6. Folio /folio/101

```
HTL-2026-0001 Budi 10-12 Okt Kamar 101 [Checked-in]
| Tgl | Deskripsi | Qty | Harga | Total |
| 10  | Deluxe x2 | 2 | 750rb | 1,5jt |
| 11  | Nasgor    | 2 | 45rb  | 90rb  |
Subtotal 1.590.000 + Pajak 174.900 = Grand 1.764.900
Sudah bayar 500.000, Sisa 1.264.900 (merah besar)
[+ Charge] [Bayar] [Cetak] [Check-Out* disabled: Lunasi dulu]
```

## W7. Housekeeping (HP 360px, tab)

```
[Perlu 12] [Kerjakan 2] [Selesai 30]  (tab atas)
+--------------------+
| 201 Checkout-clean |
| HTL-2026-0001      |
| [ Ambil ] (44px+)  |
+--------------------+
| 203 Daily-clean    |
| [ Ambil ]          |
+--------------------+
Setelah Ambil -> tombol jadi [Selesai] + (foto opsional)
```

## W8. Reports Owner

```
Filter: (from 01 Okt) (to 07 Okt) [Terapkan]
[Okupansi 72%] [ADR 850rb] [RevPAR 612rb] [Revenue 47jt]
~~~ grafik garis harian ~~~   ||| bar per tipe |||
| Tipe | Terjual | Revenue |
| Dlx  | 20 | 15jt |
```

---

## Aturan visual (biar kompak berdua)

- Warna: primary emerald/teal (resort), aksen amber untuk promo, merah hanya sisa/error.
- Kartu: radius 12, padding 16, shadow lembut.
- Font: Inter, angka tabular untuk harga.
- Status chip warna tetap:
  - confirmed biru, checked_in hijau, pending kuning, cancelled abu, no_show hitam
  - vacant_clean hijau muda, vacant_dirty kuning, occupied biru, out_of_order merah
- Semua halaman pakai `StatCard`, `StatusChip`, `EmptyState` yang sama dari `components/ui`.

---

*Wireframe ini cukup untuk slicing M0-M2. Kalau mau Figma, jiplak kotak di atas 1:1.*
