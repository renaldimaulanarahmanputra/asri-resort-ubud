// lib/utils.ts — satu-satunya tempat format uang/tanggal
// Wajib dipakai semua halaman (SRS-Frontend NFR)

export function formatRupiah(n: number): string {
  return 'Rp' + n.toLocaleString('id-ID');
}

export function formatTanggal(iso: string): string {
  // "2026-10-10" -> "10 Okt 2026"
  const [y, m, d] = iso.split('-').map(Number);
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d} ${bulan[m - 1]} ${y}`;
}

export function hitungMalam(check_in: string, check_out: string): number {
  const a = new Date(check_in).getTime();
  const b = new Date(check_out).getTime();
  return Math.max(0, Math.round((b - a) / 86400000));
}

export function isWeekend(iso: string): boolean {
  const day = new Date(iso).getDay(); // 0=Min,5=Jum,6=Sab
  return day === 0 || day === 5 || day === 6;
}

export function sensorNIK(nik: string): string {
  if (nik.length < 8) return nik;
  return nik.slice(0, 4) + '******' + nik.slice(-4);
}
