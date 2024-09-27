import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Login to the HR System</h1>
      <button
        onClick={() => signIn('supabase')}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Sign in with Supabase
      </button>
    </div>
  );
}
