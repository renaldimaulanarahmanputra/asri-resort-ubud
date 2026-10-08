// lib/order.ts — FRONTEND ONLY, 1 app terintegrasi (QR cuma pintu masuk)
// QR: /order?room=201&token=abc123 → halaman yang sama dengan booking, tanpa login.
export interface MenuItem { id: string; nama: string; harga: number; foto: string; kategori: string }

export const MENU: MenuItem[] = [
  { id: 'nasgor', nama: 'Nasi Goreng Special', harga: 45000, foto: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=60&auto=format&fit=crop', kategori: 'makanan' },
  { id: 'ayambakar', nama: 'Ayam Bakar + Nasi', harga: 55000, foto: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&q=60&auto=format&fit=crop', kategori: 'makanan' },
  { id: 'mie', nama: 'Mie Goreng Jawa', harga: 40000, foto: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=60&auto=format&fit=crop', kategori: 'makanan' },
  { id: 'kopi', nama: 'Kopi Tubruk', harga: 25000, foto: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=60&auto=format&fit=crop', kategori: 'minum' },
  { id: 'jus', nama: 'Jus Alpukat', harga: 30000, foto: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=60&auto=format&fit=crop', kategori: 'minum' },
  { id: 'lobster', nama: 'Lobster Bakar (premium)', harga: 250000, foto: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=400&q=60&auto=format&fit=crop', kategori: 'premium' },
];

// Aturan v1 yang dikunci: SEMUA menu tampil sama. Yang beda cuma tombol bayar.
// sisa_limit = limit_kamar - folio_belum_bayar
export const LIMIT_PER_TIPE: Record<string, number> = {
  superior: 1000000, deluxe: 1000000, family: 1500000, suite: 2000000, villa: 2000000,
};

export function hitungSplit(totalOrder: number, sisaLimit: number) {
  if (totalOrder <= sisaLimit) return { keKamar: totalOrder, bayarLangsung: 0, mode: 'full-kamar' as const };
  return { keKamar: sisaLimit, bayarLangsung: totalOrder - sisaLimit, mode: 'split' as const };
}
