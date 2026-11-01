"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStaff } from "@/context/StaffContext";
import { playSound } from "@/lib/sounds";
import { Shield, Lock, User, Phone, KeyRound, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStaff();
  const [phoneOrUser, setPhoneOrUser] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function getRouteForRole(role?: string) {
    if (role === "owner" || role === "manager") return "/dashboard";
    if (role === "delivery") return "/track";
    return "/cashier";
  }

  async function handleLogin(targetPhone?: string, targetPin?: string) {
    const finalPhone = targetPhone || phoneOrUser.trim();
    const finalPin = targetPin || pin.trim();

    if (!finalPhone) {
      setError("يرجى إدخال رقم الهاتف أو اسم المستخدم");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await login(finalPhone, finalPin, "phone", finalPin);
      if (res.success && res.user) {
        playSound("success");
        router.push(getRouteForRole(res.user.role));
      } else {
        playSound("alert");
        setError(res.error || "بيانات الدخول غير صحيحة، يرجى التأكد من الرقم وكود PIN");
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #0d2137 0%, #071524 60%, #030a12 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "var(--font-cairo), sans-serif",
        color: "#f8fafc",
      }}
    >
      {/* Return to Storefront */}
      <Link
        href="/"
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#94a3b8",
          textDecoration: "none",
          fontSize: "13px",
          fontWeight: 800,
        }}
      >
        <span>العودة للمتجر</span>
        <ArrowRight size={16} />
      </Link>

      {/* Brand Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 14px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #0d2137 0%, #1a3654 100%)",
            border: "2px solid #f59e0b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "38px",
            boxShadow: "0 0 25px rgba(245, 158, 11, 0.3)",
          }}
        >
          🐟
        </div>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 900,
            color: "#f59e0b",
            margin: "0 0 6px",
            letterSpacing: "0.5px",
          }}
        >
          فسيخ ورنجة الفراعنة
        </h1>
        <p style={{ fontSize: "13.5px", color: "#94a3b8", margin: 0, fontWeight: 700 }}>
          بوابة دخول الكاشير (POS) والإدارة والتشغيل السحابي
        </p>
      </div>

      {/* Login Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#0d2137",
          border: "1.5px solid #1a3654",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 900,
            color: "#f8fafc",
            margin: "0 0 4px",
            textAlign: "center",
          }}
        >
          تسجيل الدخول للمنظومة
        </h2>
        <p
          style={{
            fontSize: "12.5px",
            color: "#94a3b8",
            margin: "0 0 20px",
            textAlign: "center",
          }}
        >
          أدخل رقم الهاتف وكود الحماية PIN الخاص بحسابك
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Phone */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12.5px",
                fontWeight: 800,
                color: "#cbd5e1",
                marginBottom: "6px",
              }}
            >
              رقم الهاتف أو اسم المستخدم
            </label>
            <div style={{ position: "relative" }}>
              <Phone size={16} style={{ position: "absolute", right: "14px", top: "14px", color: "#94a3b8" }} />
              <input
                type="text"
                value={phoneOrUser}
                onChange={(e) => setPhoneOrUser(e.target.value)}
                placeholder="01069717413 أو 01000388911"
                dir="ltr"
                style={{
                  width: "100%",
                  height: "44px",
                  backgroundColor: "#071524",
                  border: "1px solid #1a3654",
                  borderRadius: "10px",
                  padding: "0 40px 0 14px",
                  fontSize: "13.5px",
                  color: "#f8fafc",
                  outline: "none",
                  textAlign: "right",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* PIN Code */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12.5px",
                fontWeight: 800,
                color: "#cbd5e1",
                marginBottom: "6px",
              }}
            >
              كود الأمان السري (PIN)
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", right: "14px", top: "14px", color: "#94a3b8" }} />
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                dir="ltr"
                style={{
                  width: "100%",
                  height: "44px",
                  backgroundColor: "#071524",
                  border: "1px solid #1a3654",
                  borderRadius: "10px",
                  padding: "0 40px 0 14px",
                  fontSize: "18px",
                  letterSpacing: "4px",
                  color: "#f59e0b",
                  outline: "none",
                  textAlign: "center",
                  boxSizing: "border-box",
                  fontWeight: 900,
                  fontFamily: "monospace",
                }}
              />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "12px",
                color: "#ef4444",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              height: "46px",
              backgroundColor: "#f59e0b",
              color: "#071524",
              fontWeight: 900,
              fontSize: "14.5px",
              borderRadius: "10px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(245, 158, 11, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "4px",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>جارٍ التحقق...</span>
              </>
            ) : (
              <span>دخول النظام</span>
            )}
          </button>
        </form>

        {/* Quick Staff Presets */}
        <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #1a3654" }}>
          <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#94a3b8", textAlign: "center", fontWeight: 700 }}>
            تسجيل دخول سريع للتجربة والتشغيل:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
            <button
              onClick={() => handleLogin("01069717413", "202600")}
              style={{
                backgroundColor: "#071524",
                border: "1px solid #1a3654",
                borderRadius: "8px",
                padding: "8px 6px",
                color: "#f59e0b",
                fontSize: "11px",
                fontWeight: 800,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              👑 المعلم المايسترو (المالك)
            </button>
            <button
              onClick={() => handleLogin("01000388911", "112233")}
              style={{
                backgroundColor: "#071524",
                border: "1px solid #1a3654",
                borderRadius: "8px",
                padding: "8px 6px",
                color: "#60a5fa",
                fontSize: "11px",
                fontWeight: 800,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              👔 مدير التشغيل العام
            </button>
            <button
              onClick={() => handleLogin("01110022334", "101010")}
              style={{
                backgroundColor: "#071524",
                border: "1px solid #1a3654",
                borderRadius: "8px",
                padding: "8px 6px",
                color: "#10b981",
                fontSize: "11px",
                fontWeight: 800,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              💻 كاشير صالة فيصل (POS)
            </button>
            <button
              onClick={() => handleLogin("01556677889", "303030")}
              style={{
                backgroundColor: "#071524",
                border: "1px solid #1a3654",
                borderRadius: "8px",
                padding: "8px 6px",
                color: "#38bdf8",
                fontSize: "11px",
                fontWeight: 800,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              🛵 كابتن حودة (دليفري)
            </button>
          </div>
        </div>

        {/* Footer Attribution */}
        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "11px", color: "#64748b" }}>
          تم تطوير النظام بواسطة شركة أوركا للحلول البرمجية والخدمات السحابية
        </div>
      </div>
    </div>
  );
}
