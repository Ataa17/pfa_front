"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignUpPage() {
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage("");
    setSuccessMessage("");

    if (!form.email || !form.password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMessage(data?.error || data?.message || "Sign up failed.");
        return;
      }

      setSuccessMessage("Account created. You can sign in now.");
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      setErrorMessage(err?.message || "Sign up failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-1">Sign Up</h1>
      <p className="text-gray-400 text-sm mb-6">Create your account to get started.</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-[11px] font-mono tracking-widest text-gray-400 uppercase mb-1.5">
            Full Name
          </label>
          <Input
            name="fullName"
            placeholder="John Doe"
            value={form.fullName}
            onChange={handleChange}
            className="bg-[#1c2333] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono tracking-widest text-gray-400 uppercase mb-1.5">
            Email
          </label>
          <Input
            name="email"
            type="email"
            placeholder="operator@aiops.io"
            value={form.email}
            onChange={handleChange}
            className="bg-[#1c2333] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
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
          <div>
            <label className="block text-[11px] font-mono tracking-widest text-gray-400 uppercase mb-1.5">
              Confirm Password
            </label>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              className="bg-[#1c2333] border-white/10 text-white focus-visible:ring-blue-500"
            />
          </div>
        </div>

        {errorMessage ? (
          <p className="text-sm text-red-400" aria-live="polite">
            {errorMessage}
          </p>
        ) : null}
        {successMessage ? (
          <p className="text-sm text-emerald-400" aria-live="polite">
            {successMessage}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white font-semibold py-5 rounded-lg mt-2"
        >
          {isSubmitting ? "Signing Up..." : "Sign Up →"}
        </Button>

        <p className="text-center text-sm text-gray-400 pt-3">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </>
  );
}