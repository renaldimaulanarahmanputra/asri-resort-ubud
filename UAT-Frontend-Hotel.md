# UAT Frontend — Hotel / Resort (checklist klik)

| Field | Nilai |
|---|---|
| Versi | 1.0 |
| Terkait | `PRD-Hotel.md`, `Sitemap-UserFlow-Hotel.md` |
| Cara pakai | Buka web, coba tiap baris, isi kolom Hasil (Lolos/Gagal) + Keterangan |
| Lolos minimal | 100% P0, 80% P1 untuk demo ke owner |

---

## A. Booking Tamu (P0 - wajib)

| ID | Langkah | Harapan | Hasil | Ket |
|---|---|---|---|---|
| U01 | Home: isi 10-12 Okt, 2 dewasa -> Cari | Masuk /rooms, tampil Deluxe dsb + total 2 malam | | |
| U02 | Pilih Deluxe -> Detail | Foto, fasilitas, kebijakan 14:00/12:00 tampil | | |
| U03 | Pesan -> isi nama+HP -> Lanjut | Kalau HP kosong ada error merah | | |
| U04 | Bayar DP 500rb QRIS -> Bayar | Dapat kode HTL-xxxx + voucher | | |
| U05 | Buka /my-booking/[kode] di HP | Kode besar, terbaca, ada tombol WA | | |
| U06 | Cari tanggal kamar habis | Tidak muncul / ada label Habis, tombol disabled | | |
| U07 | Coba checkout < checkin | Ditolak, pesan jelas | | |

## B. Front Office (P0)

| ID | Langkah | Harapan | Hasil | Ket |
|---|---|---|---|---|
| U10 | Login FO -> Dashboard | Angka Arrival/In-House/Departure/Kotor benar | | |
| U11 | Arrival HTL-2026-0001 -> Check-In kamar 101 | 101 hilang dari pilihan kamar lain, status jadi occupied | | |
| U12 | Coba check-in tanpa pilih kamar | Ditolak, pesan "Pilih kamar dulu" | | |
| U13 | Walk-in hari ini Superior | Langsung checked_in <2 menit | | |
| U14 | Extend 1 malam | Folio nambah otomatis + pajak | | |
| U15 | Pindah kamar 101 -> 103 | Kamar lama jadi vacant_dirty, baru occupied | | |
| U16 | Kamar out_of_order 108 | Tidak muncul di dropdown assign | | |

## C. Folio & Bayar (P0)

| ID | Langkah | Harapan | Hasil | Ket |
|---|---|---|---|---|
| U20 | Buka folio HTL-2026-0001 | Subtotal + pajak 11% + sisa benar | | |
| U21 | Tambah 2x Nasi Goreng 45rb | Total +90rb + pajaknya | | |
| U22 | Bayar 500rb | Sisa berkurang 500rb, ada riwayat bayar | | |
| U23 | Bayar melebihi sisa | Ditolak "Maks Rp..." | | |
| U24 | Coba checkout saat sisa >0 | Tombol terkunci + tooltip sisa | | |
| U25 | Lunasi -> checkout | Bisa checkout, kamar jadi dirty | | |
| U26 | Cetak invoice | PDF kebuka, ada pajak + kop hotel | | |

## D. Housekeeping HP 360px (P0)

| ID | Langkah | Harapan | Hasil | Ket |
|---|---|---|---|---|
| U30 | Login OB -> /housekeeping | Hanya menu itu, kartu besar | | |
| U31 | Ambil task 201 | Pindah ke Dikerjakan + ada nama OB | | |
| U32 | Selesaikan task 201 | Kamar 201 jadi vacant_clean, bisa dibooking lagi | | |
| U33 | Cek di HP, scroll horizontal? | Tidak ada scroll kanan, tombol >=44px | | |

## E. Laporan Owner (P1)

| ID | Langkah | Harapan | Hasil | Ket |
|---|---|---|---|---|
| U40 | Buka /reports 1-7 Okt | Okupansi, ADR, RevPAR muncul | | |
| U41 | Ganti filter tanggal | Angka + grafik berubah | | |
| U42 | Cek per tipe kamar | Jumlah = data folio, bukan hardcode | | |

## F. Umum / Non-fungsional (P1)

| ID | Cek | Harapan | Hasil | Ket |
|---|---|---|---|---|
| U50 | Semua list saat loading | Ada skeleton, bukan blank putih | | |
| U51 | Matikan API/mock error | Ada pesan + [Coba Lagi] | | |
| U52 | Buka tanpa login ke /dashboard | Redirect /login | | |
| U53 | OB buka /reports | Ditolak "Tidak punya akses" | | |
| U54 | Double klik Bayar | Hanya 1 transaksi tercatat | | |
| U55 | Refresh di tengah booking | Data form tidak hilang (atau ada draft) | | |

---

## Tanda tangan

| Peran | Nama | Tanggal | TTD |
|---|---|---|---|
| Frontend 1 (kamu) | | | |
| Frontend 2 (saya) | | | |
| Owner / Manager | | | |

Kesimpulan: [ ] Lolos demo v1 / [ ] Perlu perbaikan (tulis ID gagal di bawah)

Catatan perbaikan:
- 
- 
