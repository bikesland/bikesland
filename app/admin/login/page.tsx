"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      alert("Login successful!");

      router.push("/admin/dashboard");
    } catch (error: any) {
  console.error("LOGIN ERROR:", error);
  alert("Firebase Error: " + error.code);
} finally {
  setLoading(false);
}
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          🏍️ BikesLand
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Admin Login
        </p>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-black border border-zinc-700"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-5 rounded-lg bg-black border border-zinc-700"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-red-600 p-3 rounded-lg font-bold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </main>
  );
}