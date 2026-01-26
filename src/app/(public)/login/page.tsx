"use client";

import { DynamicParticleNetwork } from "@/components/animatedBackground/dynamicParticleNetwork";
import withAuth from "@/hoc/withAdmitAuth";
import { useLoginMutation } from "@/lib/api";
import { setCredentials } from "@/lib/authSlice";
import type { RootState, AppDispatch } from "@/store/store";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function LoginPage() {
  // 🔑 Hooks — TOP LEVEL ONLY
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [login, { isLoading }] = useLoginMutation();

  const accessToken = useSelector(
    (state: RootState) => state.auth.accessToken
  );

  // 🔍 Debug token change
  // useEffect(() => {
  //   if (accessToken) {
  //     console.log("✅ Global access token (Redux):", accessToken);
  //   }
  // }, [accessToken, router]);

  // 🧠 Event handler — NO hooks here
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await login({ email, password }).unwrap();

      dispatch(
        setCredentials({
          accessToken: res.access_token,
          user: res.user ?? null,
        })
      );
      router.push("/"); 
    } catch (err) {
      console.error("❌ Login failed:", err);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-50 font-inter">
      <DynamicParticleNetwork />

      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="hidden lg:flex flex-col justify-center px-20"
        >
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold tracking-tight text-slate-900 font-jakarta"
          >
            User Management
            <span className="block text-sky-600">Made Simple</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-6 max-w-md text-slate-600"
          >
            Securely manage users, roles, permissions, and access — all from a single modern dashboard.
          </motion.p>
        </motion.div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center px-6">
          <motion.form
            onSubmit={handleLogin}
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md rounded-2xl bg-white/70 p-8 backdrop-blur-xl shadow-[0_30px_70px_rgba(0,0,0,0.12)]"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-3xl font-semibold text-slate-900 font-jakarta"
            >
              Welcome back
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-1 text-sm text-slate-500"
            >
              Sign in to continue
            </motion.p>

            {/* Email */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-8"
            >
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Email address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className="w-full rounded-xl bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-inner outline-none transition focus:bg-white focus:shadow-[0_8px_20px_rgba(59,130,246,0.15)]"
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-6"
            >
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-inner outline-none transition focus:bg-white focus:shadow-[0_8px_20px_rgba(99,102,241,0.18)]"
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="mt-10 w-full rounded-xl bg-sky-600 py-3 font-semibold text-white transition hover:bg-sky-500 disabled:opacity-60"
            >
              {isLoading ? "Signing in…" : "Login"}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;