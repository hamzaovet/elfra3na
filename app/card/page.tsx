"use client";

import React from "react";
import Link from "next/link";
import { Download, ExternalLink, ArrowRight, Home, Phone, MapPin, Globe, Sparkles } from "lucide-react";

export default function CardPage() {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        backgroundColor: "#071524",
        color: "#f8fafc",
        fontFamily: "var(--font-cairo), -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 16px 60px",
      }}
    >
      {/* Header bar */}
      <header
        style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "1px solid rgba(245, 158, 11, 0.2)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#f59e0b",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: "14px",
          }}
        >
          <Home size={18} />
          <span>الرئيسية للمتجر</span>
        </Link>

        <span
          style={{
            backgroundColor: "#0d2137",
            border: "1px solid #f59e0b",
            padding: "4px 14px",
            borderRadius: "100px",
            fontSize: "12px",
            fontWeight: 900,
            color: "#f59e0b",
          }}
        >
          كارت التدشين الرسمي ورموز الـ QR 🐟
        </span>
      </header>

      {/* Main Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#0d2137",
          border: "2px solid #f59e0b",
          borderRadius: "24px",
          padding: "36px 28px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "24px",
        }}
      >
        {/* Logo & Brand */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #071524 0%, #1a3654 100%)",
              border: "2px solid #f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              marginBottom: "12px",
              boxShadow: "0 0 25px rgba(245, 158, 11, 0.3)",
            }}
          >
            🐟
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#f59e0b", margin: "0 0 6px" }}>
            فسيخ ورنجة الفراعنة
          </h1>
          <p style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 800, margin: 0 }}>
            ملوك الأسماك المملحة والمدخنة والبطارخ منذ 1990
          </p>
        </div>

        {/* QR Dual Box */}
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginTop: "10px",
          }}
        >
          {/* Web QR */}
          <div
            style={{
              backgroundColor: "#071524",
              border: "1px solid #1a3654",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 800, color: "#f59e0b" }}>
              🌐 رابط المتجر الإلكتروني
            </span>
            <div
              style={{
                width: "160px",
                height: "160px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent("https://elfra3na.vercel.app")}`}
                alt="Web QR"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <a
              href="https://elfra3na.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#cbd5e1",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 700,
                direction: "ltr",
              }}
            >
              elfra3na.vercel.app
            </a>
          </div>

          {/* APK QR */}
          <div
            style={{
              backgroundColor: "#071524",
              border: "1px solid #1a3654",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 800, color: "#10b981" }}>
              📱 تنزيل تطبيق أندرويد (APK)
            </span>
            <div
              style={{
                width: "160px",
                height: "160px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent("https://elfra3na.vercel.app/download")}`}
                alt="APK QR"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <Link
              href="/download"
              style={{
                color: "#10b981",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 800,
              }}
            >
              صفحة التحميل المباشر ⬇️
            </Link>
          </div>
        </div>

        {/* Hotlines & Branches Information */}
        <div
          style={{
            width: "100%",
            backgroundColor: "#071524",
            border: "1px solid #1a3654",
            borderRadius: "16px",
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            textAlign: "right",
            fontSize: "13px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f59e0b", fontWeight: 800 }}>
            <Phone size={16} />
            <span>الخط الساخن والدليفري:</span>
            <strong style={{ color: "#f8fafc", direction: "ltr" }}>0100 038 8911 | 0106 971 7413</strong>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "#94a3b8" }}>
            <MapPin size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>
              <strong>الفروع:</strong> فيصل الرئيسي (المطبعة) • ألف مسكن (جسر السويس) • 6 أكتوبر (الحصري) • حدائق القبة • زهراء المعادي.
            </span>
          </div>
        </div>

        {/* Footer Attribution */}
        <div style={{ fontSize: "12px", color: "#64748b" }}>
          تم تطوير النظام بواسطة شركة أوركا للحلول البرمجية والخدمات السحابية 🐬
        </div>
      </div>
    </div>
  );
}
