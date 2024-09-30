// src/app/login.tsx
import { signIn } from 'next-auth/react';
import React from 'react';
import { useState } from 'react';

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await signIn('supabase', { callbackUrl: 'https://kfllailnybrjstphttrg.supabase.co' }); // Redirect to home after login
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login with Discord'}
        </button>
      </div>
    </div>
  );
}
