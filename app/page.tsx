'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Cek sesi aktif saat halaman dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Dengarkan perubahan status login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handler Login dengan Email/Username & Password
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: emailOrUsername,
      password: password,
    });

    if (error) {
      setErrorMessage('Username/Email atau Password salah.');
    }
    setLoading(false);
  };

  // Handler Login dengan Google OAuth
  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
  };

  // Handler Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          {user ? 'Selamat Datang' : 'Portal Login'}
        </h1>

        {user ? (
          <div className="space-y-4 text-center">
            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata?.avatar_url}
                alt="Avatar"
                className="w-20 h-20 rounded-full mx-auto"
              />
            )}
            <div>
              <p className="font-semibold text-gray-700">
                {user.user_metadata?.full_name || user.email}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Form Login Biasa */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username / Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan email/username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            {/* Pembatas / Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">atau</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Tombol Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 px-4 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition shadow-sm font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Masuk dengan Google
            </button>
          </div>
        )}
      </div>
    </main>
  );
}