// app/(admin)/housekeeping/page.tsx — DASHBOARD OB, bukan dashboard FO
// Full tugas, tombol besar, tanpa angka revenue / data tamu sensitif. Frontend only (mock).
'use client';
import { useState } from 'react';

interface T { id: number; room: string; tipe: string; status: 'todo' | 'progress' | 'done' }

export default function HousekeepingPage() {
  const [list, setList] = useState<T[]>([
    { id: 1, room: '201', tipe: 'Checkout clean', status: 'todo' },
    { id: 2, room: '203', tipe: 'Daily clean', status: 'todo' },
    { id: 3, room: '301', tipe: 'Villa touch-up', status: 'progress' },
  ]);
  function aksi(id: number) {
    setList((p) => p.map((t) => (t.id === id ? { ...t, status: t.status === 'todo' ? 'progress' : 'done' } : t)).filter((t) => t.status !== 'done'));
  }
  return (
    <div className="p-4 max-w-2xl grid gap-3">
      <div className="rounded-3xl p-6 text-white" style={{ background: 'linear-gradient(120deg,#0B1D1A,#134E4A)' }}>
        <p className="text-xs tracking-[.3em] text-amber-300 font-bold">HOUSEKEEPING · TUGAS SAYA</p>
        <h1 className="text-2xl font-bold">Halo OB 👋, {list.length} kamar menunggu</h1>
      </div>
      {list.map((t) => (
        <div key={t.id} className="bg-white border rounded-2xl p-4 flex items-center gap-3">
          <div className="flex-1"><p className="font-bold">Kamar {t.room}</p><p className="text-xs text-stone-500">{t.tipe} · {t.status}</p></div>
          <button onClick={() => aksi(t.id)} className={`px-5 py-3 rounded-xl font-bold text-sm ${t.status === 'todo' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}>
            {t.status === 'todo' ? 'Ambil' : 'Selesai ✓'}
          </button>
        </div>
      ))}
      {list.length === 0 && <p className="text-sm">Semua bersih ✓</p>}
    </div>
  );
}
