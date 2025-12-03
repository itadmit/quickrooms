"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"owner" | "member">("owner");
  const [loading, setLoading] = useState(false);

  const fillCredentials = (type: "owner" | "member") => {
    setUserType(type);
    if (type === "owner") {
      setEmail("owner@example.com");
      setPassword("password123");
    } else {
      setEmail("daniel@example.com");
      setPassword("password123");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userType }),
        credentials: "include", // Important for cookies
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful, user:", data.user);
        console.log("Cookie should be set now");
        
        // Force a full page reload to ensure cookie is recognized
        if (userType === "owner") {
          window.location.href = "/dashboard/owner";
        } else {
          window.location.href = "/dashboard/member";
        }
      } else {
        alert(data.error || "שגיאה בהתחברות");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("שגיאה בהתחברות");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-24">
        <div className="max-w-md mx-auto w-full">
          <Link href="/" className="inline-block mb-12">
            <Logo />
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ברוכים הבאים
          </h1>
          <p className="text-gray-500 mb-8">
            הזן את פרטיך כדי להתחבר למערכת
          </p>

          <div className="mb-8 p-1 bg-gray-100 rounded-xl flex">
            <button
              type="button"
              onClick={() => setUserType("owner")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                userType === "owner"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              בעל מתחם
            </button>
            <button
              type="button"
              onClick={() => setUserType("member")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                userType === "member"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              חבר קהילה
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                אימייל
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                סיסמה
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "מתחבר..." : "התחבר למערכת"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-4 uppercase tracking-wider font-medium">
              כניסה מהירה למפתחים
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => fillCredentials("owner")}
                className="p-4 bg-indigo-50 hover:bg-indigo-100 text-right rounded-xl border border-indigo-200 transition-all group"
              >
                <div className="text-xs font-bold text-indigo-900 mb-2">מלא פרטי Owner</div>
                <div className="text-xs text-indigo-700 font-mono mb-1">owner@example.com</div>
                <div className="text-xs text-indigo-600 font-mono">password123</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("member")}
                className="p-4 bg-gray-50 hover:bg-gray-100 text-right rounded-xl border border-gray-200 transition-all group"
              >
                <div className="text-xs font-bold text-gray-900 mb-2">מלא פרטי Member</div>
                <div className="text-xs text-gray-700 font-mono mb-1">daniel@example.com</div>
                <div className="text-xs text-gray-600 font-mono">password123</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Decor */}
      <div className="hidden lg:block w-1/2 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
          {/* Abstract shapes */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl opacity-40"></div>
          <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-gray-300 rounded-full blur-3xl opacity-20"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center p-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              הדרך החכמה לנהל <br/> את המרחב שלך
            </h2>
            <p className="text-gray-500 max-w-sm mx-auto">
              הצטרף למאות מתחמים המנהלים את חדרי הישיבות שלהם ביעילות ובקלות עם QuickRoom.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
