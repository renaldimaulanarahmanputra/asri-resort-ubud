// lib/types.ts — kontrak tipe kita berdua, jangan pakai string bebas
// Terkait: PRD-Hotel.md §4.2, API-Contract-Hotel.md §0

export type RoomStatus =
  | 'vacant_clean'
  | 'vacant_dirty'
  | 'occupied_clean'
  | 'occupied_dirty'
  | 'out_of_order'
  | 'maintenance';

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
  | 'no_show';

export type TaskStatus = 'todo' | 'progress' | 'done';

export interface RoomType {
  id: string;
  nama: string;
  kapasitas: number;
  bed: string;
  luas: string;
  harga_weekday: number;
  harga_weekend: number;
  fasilitas: string[];
  foto: string[];
}

export interface Room {
  id: number;
  nomor: string;
  room_type_id: string;
  lantai: number;
  status: RoomStatus;
}

export interface Guest {
  id: number;
  nama: string;
  nik: string;
  no_hp: string;
  email: string;
}

export interface AvailabilityItem {
  room_type_id: string;
  nama: string;
  kapasitas: number;
  harga_per_malam: number;
  jumlah_malam: number;
  subtotal: number;
  pajak_estimasi: number;
  total_estimasi: number;
  sisa_kamar: number;
  foto: string;
}

export interface Reservation {
  id: number;
  kode: string;
  guest_id: number;
  check_in: string; // YYYY-MM-DD
  check_out: string;
  status: ReservationStatus;
  sumber: 'direct' | 'ota' | 'walkin';
}

export interface FolioItem {
  id: number;
  tanggal: string;
  deskripsi: string;
  qty: number;
  harga: number;
  total: number;
  tipe: 'kamar' | 'service' | 'denda';
}

export interface Folio {
  id: number;
  kode_booking: string;
  items: FolioItem[];
  subtotal: number;
  pajak: number;
  diskon: number;
  grand_total: number;
  sudah_bayar: number;
  sisa: number;
  status: 'open' | 'closed';
}

export interface HousekeepingTask {
  id: number;
  room_id: number;
  nomor: string;
  tipe_task: string;
  status: TaskStatus;
  assigned_to: string | null;
  reservasi_kode?: string;
}
