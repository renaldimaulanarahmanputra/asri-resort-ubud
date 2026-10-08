# SRS Frontend — Hotel / Resort v1

| Field | Nilai |
|---|---|
| Versi | 1.0 |
| Terkait | `PRD-Hotel.md`, `Sitemap-UserFlow-Hotel.md`, `API-Contract-Hotel.md` |
| Pembaca | Kita berdua (frontend) + backend |
| Tujuan | Aturan teknis rinci biar coding konsisten, tidak asal jadi |

---

## 1. Tech Stack Beku (jangan ganti di tengah jalan)

- Framework: Next.js 14 App Router + TypeScript strict
- Styling: Tailwind + shadcn/ui (Button, Dialog, Table, Toast)
- Form: React Hook Form + Zod validasi
- Data: fetch via `lib/api.ts`, cache via React Query (opsional) atau `fetch` + `revalidate`
- Chart: Recharts (laporan)
- Date: date-fns (hitung malam, format Indonesia)
- PDF invoice: print CSS `@media print` dulu (tanpa lib berat)

Struktur wajib:
```
lib/types.ts, lib/api.ts, lib/mock.ts, lib/utils.ts
components/ui/* (jangan bikin button custom tiap halaman)
```

## 2. Kebutuhan Fungsional Rinci (SRS-xxx)

### SRS-01 Search & Availability
- Input: check_in (min hari ini), check_out (min check_in+1), dewasa 1-6, anak 0-4.
- Output: list tipe yang `sisa>0` di semua malam dalam rentang.
- Validasi: checkout<=checkin -> error "Tanggal check-out harus setelah check-in".
- Loading: skeleton 3 kartu. Kosong: ilustrasi + [Ganti Tanggal].

### SRS-02 Booking Form
- Field wajib: nama (min 3 huruf), no_hp (regex Indonesia `^(\+62|08)[0-9]{8,13}$`), NIK (16 digit, boleh `-` untuk asing/corporate).
- Simpan draft ke `localStorage` tiap ketik, restore saat refresh.
- Cegah double submit: disable tombol setelah klik pertama sampai response.
- Zod schema contoh:
```ts
bookingSchema = z.object({
  nama: z.string().min(3, "Nama min 3 huruf"),
  no_hp: z.string().regex(/^(\+62|08)[0-9]{8,13}$/, "No HP tidak valid"),
  check_in: z.string(), check_out: z.string()
}).refine(d => d.check_out > d.check_in, { message: "Check-out harus setelah check-in", path: ["check_out"] })
```

### SRS-03 Auth & Role Guard
- Login: email + password -> token JWT + role.
- Middleware Next.js:
```
/dashboard, /reservations, /front-office, /folio -> resepsionis,kasir,owner
/housekeeping -> housekeeping,resepsionis,owner
/reports, /master/*, /settings -> owner saja
```
- Tanpa token -> redirect `/login?next=/dashboard` + toast.
- Tampilkan menu sidebar sesuai role (OB cuma lihat Housekeeping).

### SRS-04 Folio & Payment
- Semua uang: integer rupiah, format tampil `Rp1.665.000` via `formatRupiah()`.
- Rumus: grand = subtotal + pajak(11%) + service - diskon. Sisa = grand - sudah_bayar.
- Bayar: jumlah 1..sisa, metode wajib pilih. Double klik dicegah.
- Invoice print: header kop hotel + kode + rincian + tanda tangan kasir.

### SRS-05 Housekeeping
- Polling / refresh 30 detik (tanpa websocket dulu).
- Optimistic update: klik Selesai langsung pindah kolom, rollback kalau API gagal.
- Tombol min 44px, 1 layar HP tanpa scroll horizontal.

### SRS-06 Reports
- Filter from<=to, maks 90 hari. Default 7 hari terakhir.
- Chart kosong -> tampilkan "Belum ada transaksi" bukan grafik 0 datar.

## 3. Non-Fungsional

| Kode | Kebutuhan | Ukur |
|---|---|---|
| NFR-01 | Performa list <2s di 4G | Lighthouse Performance >=80 |
| NFR-02 | Responsif 360px-1280px | Uji manual + DevTools, tidak ada scroll-x |
| NFR-03 | Aksesibilitas dasar | Semua input ada label, kontras AA, bisa Tab |
| NFR-04 | Keamanan frontend | Token tidak di URL, XSS escape default React, NIK disensor `3271******0001` di list |
| NFR-05 | Observability | Semua error fetch log + toast, pakai Error Boundary per segmen admin/public |
| NFR-06 | Kompatibilitas | Chrome/Edge terbaru + Safari iOS, min 2 versi terakhir |

## 4. Penanganan Error (wajib sama semua halaman)

```
API 422 -> tampilkan error per field di bawah input
API 401 -> redirect login
API 404 -> halaman "Data tidak ditemukan" + [Kembali]
API 409 (contoh checkout belum lunas) -> modal kuning + nominal sisa
API 500 / network mati -> banner merah + [Coba Lagi], jangan blank putih
```

Toast bahasa Indonesia, contoh: "Kamar 101 berhasil di-assign", "Gagal menyimpan, coba lagi".

## 5. Utils Wajib (biar tidak beda format)

```ts
// lib/utils.ts
formatRupiah(1665000) // "Rp1.665.000"
formatTanggal("2026-10-10") // "10 Okt 2026"
hitungMalam("2026-10-10","2026-10-12") // 2
isWeekend("2026-10-11") // true (Sabtu)
sensorNIK("3271010101900001") // "3271******0001"
kodeBooking() // "HTL-2026-XXXX" (hanya mock)
```

## 6. Kriteria Selesai (DoD) per Fitur

- [ ] TypeScript `npm run build` tanpa error
- [ ] ESLint bersih untuk file yang diubah
- [ ] Lolos UAT terkait di `UAT-Frontend-Hotel.md`
- [ ] Manual cek HP 360px + desktop 1280px
- [ ] Tidak ada `fetch` langsung di component, semua lewat `lib/api.ts`
- [ ] Tidak ada string status bebas, semua dari `lib/types.ts`

---

*Acuan coding harian. Kalau ada aturan baru, tambah di sini dulu baru coding.*
