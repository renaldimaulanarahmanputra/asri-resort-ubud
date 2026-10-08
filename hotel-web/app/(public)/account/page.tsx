// app/(public)/account/page.tsx — AKUN SAYA (tamu), bukan dashboard staff
// Isi: booking milik user login saja. Copy ke proyek Next.js di path yang sama.
'use client';
import { useState } from 'react';
import { formatRupiah, formatTanggal } from '@/lib/utils';

interface B { kode: string; tipe: string; ci: string; co: string; status: string; total: number; sudah: number }

const AWAL: B[] = [
  { kode: 'HTL-2026-0001', tipe: 'Deluxe King', ci: '2026-10-10', co: '2026-10-12', status: 'confirmed', total: 1665000, sudah: 500000 },
  { kode: 'HTL-2026-0007', tipe: 'Pool Villa', ci: '2026-11-01', co: '2026-11-03', status: 'pending', total: 6160000, sudah: 0 },
];

export default function AccountPage() {
  const [list] = useState<B[]>(AWAL);
  return (
    <div className="max-w-3xl mx-auto p-4 grid gap-3">
      <div><p className="text-[11px] tracking-[.3em] text-stone-500">MY BOOKINGS</p>
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display' }}>Pesanan saya</h1></div>
      {list.map((b) => (
        <div key={b.kode} className="bg-[#FDFBF6] border border-stone-200 rounded-2xl p-4">
          <div className="flex items-center gap-2"><p className="font-bold">{b.kode}</p>
            <span className="text-[11px] px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">{b.status}</span>
            <span className="ml-auto text-sm font-bold">{formatRupiah(b.total - b.sudah) === 'Rp0' ? 'Lunas ✓' : 'Sisa ' + formatRupiah(b.total - b.sudah)}</span></div>
          <p className="text-sm text-stone-500 mt-1">{b.tipe} · {formatTanggal(b.ci)} → {formatTanggal(b.co)}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => alert('Buka voucher ' + b.kode)} className="text-sm border rounded-xl px-4 py-2">Lihat Voucher</button>
            {b.total - b.sudah > 0 && <button onClick={() => alert('Bayar sisa ' + formatRupiah(b.total - b.sudah))} className="text-sm bg-emerald-900 text-white rounded-xl px-4 py-2 font-semibold">Bayar Sisa</button>}
            <button onClick={() => alert('Pesan lagi tipe yang sama')} className="text-sm underline underline-offset-4 ml-auto">Pesan lagi →</button>
          </div>
        </div>
      ))}
      {list.length === 0 && <p className="text-sm text-stone-500">Belum ada pesanan. <a href="/" className="underline">Cari kamar →</a></p>}
    </div>
  );
}
