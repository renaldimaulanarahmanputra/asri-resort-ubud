// app/(admin)/master/users/page.tsx — OWNER ONLY (dijaga middleware.ts + RLS)
// Copy ke proyek Next.js kamu di path yang sama. Frontend-only, pakai mock dulu.
'use client';
import { useState } from 'react';

type Role = 'tamu' | 'resepsionis' | 'kasir' | 'housekeeping' | 'owner';
interface U { id: number; nama: string; email: string; role: Role; aktif: boolean }

const AWAL: U[] = [
  { id: 1, nama: 'Owner', email: 'owner@asriresort.com', role: 'owner', aktif: true },
  { id: 2, nama: 'Resepsionis 1', email: 'fo1@asriresort.com', role: 'resepsionis', aktif: true },
  { id: 3, nama: 'Kasir 1', email: 'kasir@asriresort.com', role: 'kasir', aktif: true },
  { id: 4, nama: 'OB Andi', email: 'ob1@asriresort.com', role: 'housekeeping', aktif: true },
  { id: 5, nama: 'Budi (Google)', email: 'budi@gmail.com', role: 'tamu', aktif: true },
];

const ROLES: Role[] = ['resepsionis', 'kasir', 'housekeeping', 'owner'];

export default function MasterUsersPage() {
  const [list, setList] = useState<U[]>(AWAL);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('resepsionis');
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');

  function tambah() {
    if (nama.trim().length < 3) return setErr('Nama min 3 huruf');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setErr('Email tidak valid');
    if (list.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) return setErr('Email sudah ada — pakai Upgrade kalau mau naikkan jadi staff');
    setErr('');
    // Asli: await ServerAction createStaff({ nama, email, role }) — owner only
    setList((p) => [...p, { id: Date.now(), nama: nama.trim(), email: email.trim(), role, aktif: true }]);
    setNama(''); setEmail('');
    alert(`Staff dibuat: ${email} (${role}), password awal: asri123 — suruh ganti saat login pertama`);
  }

  function upgrade(id: number, r: Role) {
    // Asli: upsert profiles set role — owner only. Dipakai untuk email Google yang sudah login sekali.
    setList((p) => p.map((u) => (u.id === id ? { ...u, role: r } : u)));
  }

  function resetPw(u: U) {
    // Asli: supabase.auth.admin.reset / updateUser — owner only
    alert(`Password ${u.email} direset ke: asri123 (suruh ganti)`);
  }

  function toggleAktif(id: number) {
    setList((p) => p.map((u) => (u.id === id ? { ...u, aktif: !u.aktif } : u)));
  }

  const tampil = list.filter((u) => (u.nama + u.email + u.role).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-4 md:p-6 grid gap-4 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold">Master Users — Owner saja</h1>
        <p className="text-sm text-gray-500">Tambah staff / upgrade email Google jadi staff / reset password. Publik daftar selalu tamu.</p>
      </div>

      <div className="bg-white border rounded-2xl p-4 grid gap-2">
        <h2 className="font-semibold text-sm">+ Tambah Staff</h2>
        <div className="grid md:grid-cols-4 gap-2">
          <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama (min 3)" className="border rounded-xl px-3 py-2 text-sm" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@asriresort.com" className="border rounded-xl px-3 py-2 text-sm" />
          <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="border rounded-xl px-3 py-2 text-sm">
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button onClick={tambah} className="bg-emerald-700 text-white rounded-xl px-4 py-2 text-sm font-semibold">Tambah</button>
        </div>
        {err && <p className="text-xs text-red-600">{err}</p>}
        <p className="text-[11px] text-gray-400">Password awal otomatis: <b>asri123</b>. Untuk email Google: suruh staff login Google sekali, lalu pakai Upgrade di tabel bawah.</p>
      </div>

      <div className="bg-white border rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm">Semua akun ({tampil.length})</h2>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama/email/role..." className="ml-auto border rounded-xl px-3 py-1.5 text-sm w-56" />
        </div>
        <div className="overflow-auto mt-2">
          <table className="w-full text-sm min-w-[720px]">
            <thead><tr className="text-left text-gray-500 border-b"><th className="py-2">Nama</th><th>Email</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {tampil.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{u.nama}</td>
                  <td className="text-gray-600">{u.email}</td>
                  <td>
                    <select value={u.role} disabled={u.role === 'owner'} onChange={(e) => upgrade(u.id, e.target.value as Role)} className="border rounded-lg px-2 py-1 text-xs">
                      {['tamu', ...ROLES].map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td><span className={`text-[11px] px-2 py-1 rounded-full font-bold ${u.aktif ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500'}`}>{u.aktif ? 'aktif' : 'nonaktif'}</span></td>
                  <td className="flex gap-1 py-2">
                    <button onClick={() => resetPw(u)} className="text-xs border rounded-lg px-2 py-1">Reset PW</button>
                    <button onClick={() => toggleAktif(u.id)} disabled={u.role === 'owner'} className="text-xs border rounded-lg px-2 py-1 disabled:opacity-40">{u.aktif ? 'Nonaktifkan' : 'Aktifkan'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
