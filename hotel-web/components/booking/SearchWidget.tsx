// components/booking/SearchWidget.tsx — dipakai di Home (W1)
// Props dikontrol parent biar bisa dipakai ulang. Validasi tanggal di sini.
'use client';
import { useState } from 'react';

interface Props {
  onSearch: (v: { check_in: string; check_out: string; dewasa: number }) => void;
  loading?: boolean;
}

export function SearchWidget({ onSearch, loading }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [check_in, setCheckIn] = useState(today);
  const [check_out, setCheckOut] = useState(today);
  const [dewasa, setDewasa] = useState(2);
  const [err, setErr] = useState('');

  function submit() {
    if (!check_in || !check_out) return setErr('Tanggal wajib diisi');
    if (check_out <= check_in) return setErr('Tanggal check-out harus setelah check-in');
    setErr('');
    onSearch({ check_in, check_out, dewasa });
  }

  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm grid gap-3 md:grid-cols-4">
      <label className="grid gap-1 text-sm">
        Check-in
        <input type="date" min={today} value={check_in} onChange={(e) => setCheckIn(e.target.value)} className="border rounded-lg px-3 py-2" />
      </label>
      <label className="grid gap-1 text-sm">
        Check-out
        <input type="date" min={check_in} value={check_out} onChange={(e) => setCheckOut(e.target.value)} className="border rounded-lg px-3 py-2" />
      </label>
      <label className="grid gap-1 text-sm">
        Dewasa
        <select value={dewasa} onChange={(e) => setDewasa(Number(e.target.value))} className="border rounded-lg px-3 py-2">
          {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} orang</option>)}
        </select>
      </label>
      <div className="flex items-end">
        <button onClick={submit} disabled={loading} className="w-full rounded-lg bg-emerald-600 text-white px-4 py-2 disabled:opacity-50">
          {loading ? 'Mencari...' : 'Cari Kamar'}
        </button>
      </div>
      {err && <p className="text-sm text-red-600 md:col-span-4">{err}</p>}
    </div>
  );
}
