// lib/auth.ts — FRONTEND ONLY, tanpa bikin backend sendiri
// Pilih salah satu: Supabase (disarankan) atau Firebase. Keduanya login Google murni dari frontend.

// --- OPSI A: Supabase (1 file, gratis) ---
// 1. Buat project di supabase.com -> Authentication -> Providers -> aktifkan Google
// 2. Isi Google Client ID/Secret dari console.cloud.google.com (OAuth Client Web)
// 3. Redirect URL: https://xxx.supabase.co/auth/v1/callback
// 4. npm i @supabase/supabase-js

/*
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Tombol "Lanjutkan dengan Google":
await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/dashboard' } });

// Cek user login:
const { data: { user } } = await supabase.auth.getUser();
// user.email, user.user_metadata.full_name, user.user_metadata.avatar_url

// Logout:
await supabase.auth.signOut();

// Guard role sederhana (tanpa backend):
// - email @hotel-kamu.com -> staff (resepsionis/kasir/OB/owner sesuai tabel users di Supabase)
// - selain itu -> tamu
*/

// --- OPSI B: Firebase (murni frontend juga) ---
// 1. console.firebase.google.com -> Authentication -> Sign-in method -> Google -> Enable
// 2. npm i firebase
/*
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
const app = initializeApp({ apiKey: '...', authDomain: '...', projectId: '...' });
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
await signInWithPopup(auth, provider); // popup Google asli
await signOut(auth);
*/

// Skema email+password (tetap frontend-only via Supabase):
// - Daftar: supabase.auth.signUp({ email, password, options: { data: { nama } } })
// - Masuk:  supabase.auth.signInWithPassword({ email, password })
// - Validasi frontend (Zod): email valid, password min 6, nama min 3 saat daftar
// - Lupa password: supabase.auth.resetPasswordForEmail(email)
// Contoh validasi yang dipakai preview:
//   /^[^@\s]+@[^@\s]+\.[^@\s]+$/ untuk email, pw.length>=6

// Simulasi yang dipakai preview-hotel.html sekarang:
export type DemoUser = { email: string; role: 'tamu' | 'staff' };
export function mockGoogleLogin(role: 'tamu' | 'staff' = 'tamu'): DemoUser {
  return role === 'staff'
    ? { email: 'fo@hotel.com', role: 'staff' }
    : { email: 'budi@gmail.com', role: 'tamu' };
}
export function mockEmailLogin(email: string, password: string): DemoUser {
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Email tidak valid');
  if (password.length < 6) throw new Error('Password min 6 karakter');
  return { email, role: email.includes('@hotel') ? 'staff' : 'tamu' };
}
