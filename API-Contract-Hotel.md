# API Contract — Sistem Hotel / Resort (untuk Frontend)

| Field | Nilai |
|---|---|
| Versi | 1.0 |
| Base URL dev | `http://localhost:3000/api` (mock dulu) |
| Base URL prod | `https://hotel-kamu.com/api` |
| Format | JSON, `{ success, data, message }` |
| Auth | `Authorization: Bearer <token>` kecuali public booking |
| Terkait | `PRD-Hotel.md`, `Sitemap-UserFlow-Hotel.md` |

Cara pakai buat kita: selama backend belum jadi, set `USE_MOCK=true` di `lib/api.ts`. Bentuk data mock **harus persis** seperti di dokumen ini, jadi nanti ganti ke API asli tinggal ganti URL.

---

## 0. Aturan Global

**Sukses:**
```json
{ "success": true, "data": { }, "message": "OK" }
```

**Gagal:**
```json
{ "success": false, "data": null, "message": "Kamar tidak tersedia di tanggal itu" }
```

**Error validasi (422):**
```json
{ "success": false, "data": { "errors": { "no_hp": ["No HP wajib"] } }, "message": "Validasi gagal" }
```

**Tipe inti (`lib/types.ts`):**

```ts
type RoomStatus = 'vacant_clean' | 'vacant_dirty' | 'occupied_clean' | 'occupied_dirty' | 'out_of_order' | 'maintenance';
type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';

interface RoomType {
  id: string; nama: string; kapasitas: number;
  harga_weekday: number; harga_weekend: number;
  fasilitas: string[]; foto: string[];
}
interface Room { id: number; nomor: string; room_type_id: string; lantai: number; status: RoomStatus; }
interface Reservation {
  id: number; kode: string; guest_id: number;
  check_in: string; check_out: string; // YYYY-MM-DD
  status: ReservationStatus; sumber: 'direct' | 'ota' | 'walkin';
  total_estimasi: number;
}
```

---

## 1. Availability & Booking (Public, tanpa login)

### GET /availability — cek kamar tersedia

Query: `?check_in=2026-10-10&check_out=2026-10-12&dewasa=2&anak=0`

Response:
```json
{
  "success": true,
  "data": [
    {
      "room_type_id": "deluxe",
      "nama": "Deluxe King",
      "kapasitas": 2,
      "harga_per_malam": 750000,
      "jumlah_malam": 2,
      "subtotal": 1500000,
      "pajak_estimasi": 165000,
      "total_estimasi": 1665000,
      "sisa_kamar": 4,
      "foto": "/images/deluxe-1.jpg"
    }
  ],
  "message": "OK"
}
```
Frontend: kalau `sisa_kamar = 0` jangan tampilkan. Hitung malam = checkout - checkin.

### POST /reservations — buat booking

Body:
```json
{
  "guest": { "nama": "Budi", "nik": "327xxx", "no_hp": "0812xxx", "email": "budi@mail.com" },
  "check_in": "2026-10-10",
  "check_out": "2026-10-12",
  "dewasa": 2, "anak": 0,
  "items": [{ "room_type_id": "deluxe", "qty": 1 }],
  "request": "lantai atas",
  "sumber": "direct"
}
```
Response (201):
```json
{
  "success": true,
  "data": { "id": 101, "kode": "HTL-2026-0001", "status": "pending", "total_estimasi": 1665000, "dp_minimal": 500000 },
  "message": "Booking dibuat, silakan bayar DP"
}
```

### GET /reservations/kode/:kode — tamu cek status

Response:
```json
{
  "success": true,
  "data": {
    "kode": "HTL-2026-0001", "status": "confirmed",
    "check_in": "2026-10-10", "check_out": "2026-10-12",
    "kamar": [{ "tipe": "Deluxe King", "nomor": "belum assign" }],
    "sisa_tagihan": 1165000
  },
  "message": "OK"
}
```

---

## 2. Front Office (login resepsionis)

### GET /reservations — list + filter

Query: `?tanggal=2026-10-10&tipe=arrival&status=confirmed&q=budi`

`tipe`: `arrival` (check_in=tanggal) | `departure` (check_out=tanggal) | `inhouse` (menginap) | `all`

Response:
```json {
  "success": true,
  "data": [
    { "id": 101, "kode": "HTL-2026-0001", "tamu": "Budi", "tipe": "Deluxe", "check_in": "2026-10-10", "check_out": "2026-10-12", "status": "confirmed" }
  ],
  "message": "OK"
}
```

### GET /rooms/available — untuk modal assign

Query: `?room_type_id=deluxe&check_in=2026-10-10&check_out=2026-10-12`

Hanya kembalikan yang `vacant_clean`:
```json
{ "success": true, "data": [{ "id": 1, "nomor": "101", "status": "vacant_clean" }], "message": "OK" }
```

### POST /reservations/:id/checkin

Body: `{ "room_assignments": [{ "room_id": 1 }], "deposit": 200000 }`

Efek: reservasi -> `checked_in`, kamar -> `occupied_clean`.

### POST /reservations/:id/checkout

Gagal kalau folio belum lunas (409):
```json
{ "success": false, "data": null, "message": "Masih ada sisa Rp1.165.000, lunasi dulu" }
```
Sukses: reservasi -> `checked_out`, kamar -> `vacant_dirty` + auto task housekeeping.

### POST /reservations/:id/extend | /move

```json
// extend
{ "check_out_baru": "2026-10-13" }
// move
{ "room_id_lama": 1, "room_id_baru": 5 }
```

---

## 3. Folio & Payment (kasir + resepsionis lihat)

### GET /folios/:reservation_id

```json
{
  "success": true,
  "data": {
    "id": 55, "kode_booking": "HTL-2026-0001",
    "items": [
      { "id": 1, "tanggal": "2026-10-10", "deskripsi": "Deluxe King x 2 malam", "qty": 2, "harga": 750000, "total": 1500000, "tipe": "kamar" },
      { "id": 2, "tanggal": "2026-10-11", "deskripsi": "Resto - Nasi Goreng", "qty": 2, "harga": 45000, "total": 90000, "tipe": "service" }
    ],
    "subtotal": 1590000, "pajak": 174900, "diskon": 0,
    "grand_total": 1764900, "sudah_bayar": 500000, "sisa": 1264900,
    "status": "open"
  },
  "message": "OK"
}
```

### POST /folios/:id/items — tambah charge

Body: `{ "deskripsi": "Laundry", "qty": 3, "harga": 20000, "tipe": "service" }`

### POST /folios/:id/payments — terima bayar

Body: `{ "metode": "QRIS", "jumlah": 500000, "referensi": "QR-123" }`

Aturan backend (frontend juga validasi):
- `jumlah > 0 && jumlah <= sisa`, kalau tidak -> 422.

### GET /folios/:id/invoice — cetak PDF

Return URL file: `{ "success": true, "data": { "pdf_url": "/invoices/HTL-2026-0001.pdf" } }`

---

## 4. Housekeeping (OB via HP)

### GET /housekeeping?status=todo&tanggal=2026-10-10

```json
{
  "success": true,
  "data": [
    { "id": 201, "room_id": 3, "nomor": "201", "tipe_task": "checkout_clean", "status": "todo", "assigned_to": null, "reservasi_kode": "HTL-2026-0001" }
  ],
  "message": "OK"
}
```

### PATCH /housekeeping/:id

Body: `{ "status": "progress" }` atau `{ "status": "done", "foto_url": "...", "catatan": "ganti sprei" }`

Efek `done`: kamar terkait -> `vacant_clean`.

---

## 5. Reports (owner)

### GET /reports/daily?from=2026-10-01&to=2026-10-07

```json
{
  "success": true,
  "data": {
    "ringkasan": { "okupansi_pct": 72.5, "adr": 850000, "revpar": 612500, "revenue_kamar": 42000000, "revenue_service": 5000000, "total_revenue": 47000000 },
    "harian": [{ "tanggal": "2026-10-01", "okupansi": 70, "revenue": 6000000 }],
    "per_tipe": [{ "room_type_id": "deluxe", "terjual": 20, "revenue": 15000000 }]
  },
  "message": "OK"
}
```
Rumus (biar sama):
- `okupansi = terjual / total_aktif * 100`
- `adr = revenue_kamar / terjual`
- `revpar = revenue_kamar / total_aktif`

---

## 6. Master + Akun (owner only, tanpa approve)

```
GET /room-types, POST /room-types, PATCH /room-types/:id
GET /rooms, POST /rooms, PATCH /rooms/:id {status}
GET /users, POST /users, PATCH /users/:id
GET /settings, PATCH /settings {pajak_pct, service_pct, jam_checkin, jam_checkout, dp_min_pct}
```

**Aturan akun (1 pintu, silent role):**
- `POST /auth/register` publik → selalu `role=tamu`. Tidak ada parameter role dari frontend.
- `POST /users` (owner only) → buat staff: `{ nama, email, role: resepsionis|kasir|housekeeping|owner, password_awal }`
- `PATCH /users/:id` → upgrade email Google jadi staff / reset password / nonaktifkan.
- `GET /me` → `{ id, email, role }` dipakai frontend untuk redirect diam-diam (tamu→`/`, staff→`/dashboard`).
- TIDAK ADA endpoint approve. Kalau ada yang minta `POST /users/approve`, tolak — pola itu sudah disepakati tidak dipakai.

Contoh settings:
```json
{ "pajak_pct": 11, "service_pct": 5, "jam_checkin": "14:00", "jam_checkout": "12:00", "dp_min_pct": 30 }
```

---

## 7. Implementasi Mock di Frontend (`lib/api.ts`)

```ts
const USE_MOCK = true;

export async function getAvailability(params) {
  if (USE_MOCK) return mockAvailability(params); // dari lib/mock.ts
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`/api/availability?${q}`);
  return res.json();
}
// pola sama untuk semua endpoint di atas
```

Checklist sebelum ganti ke API asli:
- [ ] Bentuk JSON mock sudah sama persis dengan dokumen ini
- [ ] Semua `fetch` lewat `lib/api.ts`, tidak ada fetch langsung di component
- [ ] Token disimpan di httpOnly cookie / localStorage + dikirim di header
- [ ] Semua error tampil toast Indonesia, bukan `console.log` saja

---

*Selesai. Dengan 3 file ini (PRD + Sitemap + API Contract) kamu sudah bisa slicing M1 tanpa nunggu backend.*
