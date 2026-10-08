// app/(admin)/kitchen/page.tsx — 1 app sama, dapur lihat order QR real-time (mock polling)
'use client';
import { useState } from 'react';

interface O { id: number; room: string; items: string; total: number; status: 'baru' | 'dimasak' | 'diantar' | 'selesai' }

export default function KitchenPage() {
  const [list, setList] = useState<O[]>([
    { id: 1, room: '201', items: '2x Nasi Goreng', total: 90000, status: 'baru' },
    { id: 2, room: 'A1', items: '1x Lobster', total: 250000, status: 'dimasak' },
  ]);
  function next(id: number) {
    setList((p) => p.map((o) => {
      if (o.id !== id) return o;
      const nx = o.status === 'baru' ? 'dimasak' : o.status === 'dimasak' ? 'diantar' : 'selesai';
      // Asli: PATCH /orders/:id {status} + trigger ke folio/toast tamu
      return { ...o, status: nx };
    }).filter((o) => o.status !== 'selesai'));
  }
  return (
    <div className="p-4 max-w-4xl grid gap-3">
      <h1 className="font-bold text-lg">Dapur — Order Masuk (terintegrasi folio)</h1>
      <p className="text-xs text-gray-500">Sumber: QR kamar (/order). Accept di sini → otomatis masuk folio kamar, tidak input ulang.</p>
      {list.map((o) => (
        <div key={o.id} className="bg-white border rounded-2xl p-4 flex items-center gap-3">
          <div className="flex-1"><p className="font-bold text-sm">Kamar {o.room} · {o.items}</p><p className="text-xs text-gray-500">Rp{o.total.toLocaleString('id-ID')} → masuk folio · status: <b>{o.status}</b></p></div>
          <button onClick={() => next(o.id)} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold">
            {o.status === 'baru' ? 'Masak' : o.status === 'dimasak' ? 'Antar' : 'Selesai'}
          </button>
        </div>
      ))}
      {list.length === 0 && <p className="text-sm text-gray-500">Dapur bersih ✓</p>}
    </div>
  );
}
