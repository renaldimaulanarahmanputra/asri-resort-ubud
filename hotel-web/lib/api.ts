// lib/api.ts — FRONTEND ONLY, tanpa backend
// Selama backend belum ada, USE_MOCK=true pakai lib/mock.ts.
// Nanti ganti ke fetch API asli tanpa ubah component.

import { roomTypes, rooms, settings } from './mock';
import { hitungMalam, isWeekend } from './utils';
import type { AvailabilityItem } from './types';

const USE_MOCK = true;

type ApiOk<T> = { success: true; data: T; message: string };
type ApiFail = { success: false; data: null; message: string };

export async function getAvailability(params: {
  check_in: string;
  check_out: string;
  dewasa: number;
}): Promise<ApiOk<AvailabilityItem[]> | ApiFail> {
  if (!USE_MOCK) {
    const q = new URLSearchParams({
      check_in: params.check_in,
      check_out: params.check_out,
      dewasa: String(params.dewasa),
    }).toString();
    const res = await fetch(`/api/availability?${q}`);
    return res.json();
  }

  // --- mock logic (frontend only) ---
  if (!params.check_in || !params.check_out) {
    return { success: false, data: null, message: 'Tanggal wajib diisi' };
  }
  if (params.check_out <= params.check_in) {
    return { success: false, data: null, message: 'Tanggal check-out harus setelah check-in' };
  }

  const malam = hitungMalam(params.check_in, params.check_out);
  const data: AvailabilityItem[] = roomTypes
    .filter((t) => t.kapasitas >= params.dewasa)
    .map((t) => {
      // harga pakai weekend jika salah satu malam jatuh weekend (sederhana)
      const harga = isWeekend(params.check_in) ? t.harga_weekend : t.harga_weekday;
      const subtotal = harga * malam;
      const pajak = Math.round(subtotal * (settings.pajak_pct / 100));
      const sisa = rooms.filter(
        (r) => r.room_type_id === t.id && r.status === 'vacant_clean',
      ).length;
      return {
        room_type_id: t.id,
        nama: t.nama,
        kapasitas: t.kapasitas,
        harga_per_malam: harga,
        jumlah_malam: malam,
        subtotal,
        pajak_estimasi: pajak,
        total_estimasi: subtotal + pajak,
        sisa_kamar: sisa,
        foto: t.foto[0],
      };
    })
    .filter((x) => x.sisa_kamar > 0); // kamar habis/kotor tidak tampil

  return { success: true, data, message: 'OK' };
}

export async function getRoomsAvailable(room_type_id: string) {
  // Untuk modal assign check-in: hanya vacant_clean
  if (!USE_MOCK) {
    const res = await fetch(`/api/rooms/available?room_type_id=${room_type_id}`);
    return res.json();
  }
  const data = rooms.filter(
    (r) => r.room_type_id === room_type_id && r.status === 'vacant_clean',
  );
  return { success: true, data, message: 'OK' };
}
