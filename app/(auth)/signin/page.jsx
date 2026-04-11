"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-1">Sign In</h1>
      <p className="text-gray-400 text-sm mb-6">Welcome back.</p>

      <form className="space-y-4">
        <div>
          <label className="block text-[11px] font-mono tracking-widest text-gray-400 uppercase mb-1.5">
            Email
          </label>
          <Input
            name="email"
            type="email"
            placeholder="operator@sovereign.io"
            value={form.email}
            onChange={handleChange}
            className="bg-[#1c2333] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono tracking-widest text-gray-400 uppercase mb-1.5">
            Password
          </label>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="bg-[#1c2333] border-white/10 text-white focus-visible:ring-blue-500"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white font-semibold py-5 rounded-lg mt-2"
        >
          Sign In →
        </Button>

        <p className="text-center text-sm text-gray-400 pt-3">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-400 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </>
  );
}