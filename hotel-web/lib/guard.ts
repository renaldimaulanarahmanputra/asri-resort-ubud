// hotel-web/lib/guard.ts — helper dipakai di Server Component / Server Action
// Tetap frontend, tapi ini yang cegah tamu POST jadi staff via DevTools.
import { redirect } from 'next/navigation';

export type Role = 'tamu' | 'resepsionis' | 'kasir' | 'housekeeping' | 'owner';

export function requireRole(role: Role | undefined, allowed: Role[], fallback = '/login') {
  if (!role || !allowed.includes(role)) redirect(fallback + '?err=no-access');
}

// Contoh pakai di page.tsx (Server Component):
// const { data: { user } } = await supabase.auth.getUser();
// const { data: p } = await supabase.from('profiles').select('role').eq('id', user!.id).single();
// requireRole(p?.role as Role, ['owner'], '/dashboard'); // untuk /master/users

// Contoh Server Action buat staff (owner only):
// 'use server'
// export async function createStaff(form: { nama: string; email: string; role: Role; password: string }) {
//   // 1. cek role pemanggil == owner, kalau bukan -> throw
//   // 2. supabase.auth.admin.createUser({ email, password, email_confirm: true })
//   // 3. supabase.from('profiles').upsert({ id, email, nama, role: form.role })
//   // Publik register TIDAK boleh kirim role — selalu 'tamu' di sini.
// }
