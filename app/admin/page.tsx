"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "123456") {
      router.push("/admin/dashboard");
    } else {
      alert("Invalid Username or Password");
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800">

        <h1 className="text-3xl font-bold text-white text-center mb-8">
          🔐 BikesLand Admin
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-zinc-800 text-white outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-lg bg-zinc-800 text-white outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold text-white"
        >
          Login
        </button>

      </div>
    </main>
  );
}