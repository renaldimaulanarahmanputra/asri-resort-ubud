// lib/mock.ts — data dummy dari Template-Data-Checklist-Hotel.md
// Dipakai selama USE_MOCK=true, bentuknya persis API asli
import type { Room, RoomType } from './types';

export const roomTypes: RoomType[] = [
  { id: 'superior', nama: 'Superior Twin', kapasitas: 2, bed: 'Twin 120x200 x2', luas: '28m2', harga_weekday: 650000, harga_weekend: 800000, fasilitas: ['AC', 'TV 43"', 'WiFi', 'Air panas'], foto: ['/images/superior-1.jpg'] },
  { id: 'deluxe', nama: 'Deluxe King', kapasitas: 2, bed: 'King 180x200', luas: '32m2', harga_weekday: 750000, harga_weekend: 950000, fasilitas: ['AC', 'TV 50"', 'WiFi', 'Balkon', 'Bathtub'], foto: ['/images/deluxe-1.jpg'] },
  { id: 'family', nama: 'Family Room', kapasitas: 4, bed: 'King + Single x2', luas: '45m2', harga_weekday: 1200000, harga_weekend: 1450000, fasilitas: ['AC', 'TV 50"', 'Sofa', 'Microwave'], foto: ['/images/family-1.jpg'] },
  { id: 'suite', nama: 'Executive Suite', kapasitas: 3, bed: 'King + Sofa bed', luas: '60m2', harga_weekday: 1500000, harga_weekend: 1800000, fasilitas: ['Ruang tamu', 'Bathtub', 'Lounge access'], foto: ['/images/suite-1.jpg'] },
  { id: 'villa', nama: 'Pool Villa', kapasitas: 4, bed: 'King x2', luas: '120m2', harga_weekday: 2500000, harga_weekend: 3200000, fasilitas: ['Private pool', 'Dapur', 'Carport'], foto: ['/images/villa-1.jpg'] },
];

export const rooms: Room[] = [
  { id: 1, nomor: '101', room_type_id: 'superior', lantai: 1, status: 'vacant_clean' },
  { id: 2, nomor: '102', room_type_id: 'superior', lantai: 1, status: 'occupied_clean' },
  { id: 3, nomor: '103', room_type_id: 'superior', lantai: 1, status: 'vacant_clean' },
  { id: 4, nomor: '104', room_type_id: 'superior', lantai: 1, status: 'vacant_dirty' },
  { id: 11, nomor: '201', room_type_id: 'deluxe', lantai: 2, status: 'vacant_clean' },
  { id: 12, nomor: '202', room_type_id: 'deluxe', lantai: 2, status: 'occupied_clean' },
  { id: 13, nomor: '203', room_type_id: 'deluxe', lantai: 2, status: 'vacant_dirty' },
  { id: 14, nomor: '204', room_type_id: 'deluxe', lantai: 2, status: 'vacant_clean' },
  { id: 21, nomor: '301', room_type_id: 'family', lantai: 3, status: 'vacant_clean' },
  { id: 26, nomor: '401', room_type_id: 'suite', lantai: 4, status: 'vacant_clean' },
  { id: 29, nomor: 'A1', room_type_id: 'villa', lantai: 1, status: 'vacant_clean' },
  { id: 30, nomor: 'A2', room_type_id: 'villa', lantai: 1, status: 'vacant_clean' },
];

export const settings = {
  pajak_pct: 11,
  jam_checkin: '14:00',
  jam_checkout: '12:00',
  dp_min_pct: 30,
};
