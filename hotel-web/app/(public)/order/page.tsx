// app/(public)/order/page.tsx — halaman QR scan, TANPA login, token kamar saja
// URL: /order?room=201&token=abc123 — 1 app sama dengan booking, terintegrasi folio.
'use client';
import { useState } from 'react';
import { MENU, LIMIT_PER_TIPE, hitungSplit } from '@/lib/order';
import { formatRupiah } from '@/lib/utils';

export default function OrderPage() {
  // Mock konteks kamar dari QR (asli: validasi token via Server Action)
  const room = '201';
  const tipe = 'deluxe';
  const folioBelumBayar = 300000; // contoh: sudah jajan 300rb
  const limit = LIMIT_PER_TIPE[tipe];
  const sisaLimit = limit - folioBelumBayar;

  const [cart, setCart] = useState<Record<string, number>>({ nasgor: 2 });
  const [pin, setPin] = useState('');

  const total = Object.entries(cart).reduce((s, [id, q]) => s + (MENU.find((m) => m.id === id)?.harga ?? 0) * q, 0);
  const split = hitungSplit(total, sisaLimit);

  function tambah(id: string) { setCart((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 })); }
  function kurang(id: string) { setCart((p) => ({ ...p, [id]: Math.max(0, (p[id] ?? 0) - 1) })); }

  function pesan() {
    if (pin.length < 4) return alert('Masukkan PIN kamar 4 digit (ada di key holder) biar tidak bisa diiseng orang');
    // Asli: POST /folios/:id/items { menu, qty } + catat ke /orders untuk dapur
    if (split.mode === 'full-kamar') alert(`Order ${formatRupiah(total)} → tagih penuh ke Kamar ${room}. Masuk folio + dapur.`);
    else alert(`Sisa limit ${formatRupiah(sisaLimit)}. ${formatRupiah(split.keKamar)} ke kamar, selisih ${formatRupiah(split.bayarLangsung)} bayar QRIS sekarang.`);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 grid gap-4">
      <div className="bg-emerald-900 text-white rounded-2xl p-4">
        <p className="text-xs opacity-70">PESAN DARI KAMAR {room} · {tipe}</p>
        <h1 className="font-bold text-lg">Mau makan apa malam ini?</h1>
        <p className="text-xs opacity-70">Sisa limit tagih kamar: {formatRupiah(sisaLimit)} (limit {formatRupiah(limit)} − sudah jajan {formatRupiah(folioBelumBayar)})</p>
      </div>
      <div className="grid gap-3">
        {MENU.map((m) => (
          <div key={m.id} className="bg-white border rounded-2xl p-3 flex gap-3 items-center">
            <img src={m.foto} className="w-16 h-16 rounded-xl object-cover" alt={m.nama} />
            <div className="flex-1"><p className="font-semibold text-sm">{m.nama}</p><p className="text-sm text-gray-600">{formatRupiah(m.harga)}</p></div>
            <div className="flex items-center gap-2">
              <button onClick={() => kurang(m.id)} className="w-8 h-8 border rounded-lg">−</button>
              <span className="w-6 text-center text-sm font-bold">{cart[m.id] ?? 0}</span>
              <button onClick={() => tambah(m.id)} className="w-8 h-8 bg-emerald-700 text-white rounded-lg">+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white border rounded-2xl p-4 grid gap-2 sticky bottom-2 shadow-lg">
        <p className="font-bold">Total: {formatRupiah(total)}</p>
        {split.mode === 'full-kamar'
          ? <p className="text-xs text-emerald-700">✓ Bisa full tagih ke kamar {room}</p>
          : <p className="text-xs text-amber-700">Sisa limit {formatRupiah(sisaLimit)} → {formatRupiah(split.keKamar)} ke kamar + selisih {formatRupiah(split.bayarLangsung)} QRIS</p>}
        <input value={pin} onChange={(e) => setPin(e.target.value)} inputMode="numeric" maxLength={4} placeholder="PIN kamar 4 digit" className="border rounded-xl px-3 py-2 text-sm" />
        <button onClick={pesan} className="bg-emerald-700 text-white rounded-xl py-3 font-semibold">
          {split.mode === 'full-kamar' ? `Tagihkan ke Kamar ${room}` : `Tagih Sebagian + Bayar Selisih QRIS`}
        </button>
      </div>
    </div>
  );
}
