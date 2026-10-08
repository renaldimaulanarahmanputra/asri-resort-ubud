# hotel-web — Frontend Only (tanpa backend)

Scaffolding M0 untuk kita berdua. Semua data dari `lib/mock.ts`, tidak ada database / API server.

## Yang sudah jadi

- `lib/types.ts` — tipe status + room + folio (jangan ubah sembarangan)
- `lib/mock.ts` — 5 tipe + contoh kamar (copy dari Template-Data)
- `lib/utils.ts` — formatRupiah, formatTanggal, hitungMalam
- `lib/api.ts` — `USE_MOCK=true`, fungsi `getAvailability()` + `getRoomsAvailable()`
- `components/ui/StatusChip.tsx` + `EmptyState.tsx`
- `components/booking/SearchWidget.tsx` + `RoomCard.tsx`

## Cara pakai di Next.js kamu

1. Copy folder `hotel-web/lib` dan `hotel-web/components` ke proyek Next.js kamu (`npx create-next-app@latest` + Tailwind).
2. Contoh pakai di halaman:

```tsx
'use client';
import { useState } from 'react';
import { SearchWidget } from '@/components/booking/SearchWidget';
import { RoomCard } from '@/components/booking/RoomCard';
import { getAvailability } from '@/lib/api';

export default function RoomsPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  async function cari(v: any) {
    setLoading(true);
    const res = await getAvailability(v);
    setLoading(false);
    if (res.success) setList(res.data);
    else alert(res.message);
  }
  return (
    <div className="grid gap-4 p-4">
      <SearchWidget onSearch={cari} loading={loading} />
      {list.map((it) => <RoomCard key={it.room_type_id} item={it} onPilih={() => alert(it.nama)} />)}
    </div>
  );
}
```

3. Aturan: semua fetch lewat `lib/api.ts`, semua uang via `formatRupiah()`, semua status via `StatusChip`.

## Bukan backend

- Tidak ada folder `app/api`, tidak ada koneksi DB di sini.
- Nanti backend siap, tinggal set `USE_MOCK=false` dan samakan bentuk JSON dengan `API-Contract-Hotel.md`.
