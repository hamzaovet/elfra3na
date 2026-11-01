"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Clock, ShieldCheck, Heart, Sparkles, Smartphone } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer completely on Login and Cashier POS to keep them clean & focused
  if (pathname === "/login" || pathname === "/cashier") {
    return null;
  }

  // On Admin & Operations Pages: Show only a minimalist 1-line legal attribution
  const isAdminPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/kitchen") ||
    pathname.startsWith("/inventory") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/customers") ||
    pathname.startsWith("/offers-admin") ||
    pathname.startsWith("/menu-admin") ||
    pathname.startsWith("/users");

  if (isAdminPage) {
    return (
      <footer
        style={{
          width: "100%",
          padding: "16px 20px",
          backgroundColor: "#071524",
          borderTop: "1px solid rgba(245, 158, 11, 0.2)",
          textAlign: "center",
          fontSize: "12px",
          color: "#94a3b8",
          direction: "rtl",
        }}
      >
        <span>© {new Date().getFullYear()} فسيخ ورنجة الفراعنة (El-Fra3na) • </span>
        <span style={{ color: "#f59e0b", fontWeight: 800 }}>
          تم تطوير النظام بواسطة شركة أوركا للحلول البرمجية والخدمات السحابية
        </span>
      </footer>
    );
  }

  // PUBLIC STOREFRONT FOOTER (Pharaonic Oceanic Navy & Smoked Gold Theme)
  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "#071524",
        borderTop: "3px solid #f59e0b",
        color: "#f8fafc",
        paddingTop: "48px",
        paddingBottom: "90px", // space for bottom nav bar on mobile
        marginTop: "40px",
        fontFamily: "var(--font-cairo), system-ui, -apple-system, sans-serif",
        direction: "rtl",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "36px",
          boxSizing: "border-box",
        }}
      >
        {/* Column 1: Brand Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                border: "2px solid #f59e0b",
                background: "linear-gradient(135deg, #0d2137 0%, #1a3654 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              🐟
            </div>
            <div>
              <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#f59e0b", margin: 0 }}>
                فسيخ ورنجة الفراعنة
              </h3>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0, fontWeight: 800 }}>
                EL-FRA3NA • ملوك الأسماك المملحة والمدخنة والبطارخ منذ 1990
              </p>
            </div>
          </div>
          <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#cbd5e1", margin: 0, fontWeight: 600 }}>
            أفخر أنواع الفسيخ البوري البلدي السوبر جامبو الزبدة، والرنجة الهولندي الذهبية المدخنة خشب زان بطارخ خرز مقرمشة، والبطارخ البورسعيدية الشمع العسلي، والملوحة الأسوانية الأصلية من بحيرة ناصر.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
            <Link
              href="/download"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                backgroundColor: "#f59e0b",
                color: "#071524",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 900,
                padding: "8px 16px",
                borderRadius: "100px",
                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
              }}
            >
              <Smartphone size={14} />
              <span>تحميل تطبيق الأندرويد الرسمي (APK)</span>
            </Link>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 900, color: "#f59e0b", marginBottom: "8px" }}>
            أقسام وقائمة الأسماك
          </h4>
          <Link href="/#menu-section" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>
            🐟 فسيخ الملوك بوري بلدي سوبر جامبو
          </Link>
          <Link href="/#menu-section" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>
            👑 رنجة هولندي سوبر لوكس وبطارخ خرز
          </Link>
          <Link href="/#menu-section" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>
            🥇 بطارخ بوري بورسعيدي مجففة شمع
          </Link>
          <Link href="/#offers-section" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>
            🎁 بوكسات العزومات والميكسات الملكية
          </Link>
          <Link href="/track" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>
            🛵 تتبع خط سير الطيار والأوردر لحظياً
          </Link>
          <Link href="/login" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>
            🔐 تسجيل دخول الكاشير والإدارة (POS)
          </Link>
        </div>

        {/* Column 3: Contact & Delivery */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 900, color: "#f59e0b", marginBottom: "4px" }}>
            الخط الساخن وطلبات الدليفري
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#cbd5e1", fontSize: "13.5px" }}>
            <Phone size={16} color="#f59e0b" />
            <a href="tel:01000388911" style={{ color: "#f8fafc", textDecoration: "none", fontWeight: 800, direction: "ltr" }}>
              0100 038 8911
            </a>
            <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 700 }}>(الخط الرئيسي الساخن)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#cbd5e1", fontSize: "13.5px" }}>
            <Phone size={16} color="#10b981" />
            <a href="https://wa.me/201069717413" target="_blank" rel="noopener noreferrer" style={{ color: "#f8fafc", textDecoration: "none", fontWeight: 800, direction: "ltr" }}>
              0106 971 7413
            </a>
            <span style={{ color: "#94a3b8", fontSize: "12px" }}>(واتساب وحجز البوكسات)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#cbd5e1", fontSize: "13.5px" }}>
            <Phone size={16} color="#f59e0b" />
            <a href="tel:01110022334" style={{ color: "#f8fafc", textDecoration: "none", fontWeight: 800, direction: "ltr" }}>
              0111 002 2334
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#94a3b8", fontSize: "12.5px", marginTop: "4px" }}>
            <Clock size={15} color="#f59e0b" />
            <span>نعمل يومياً من الساعة 10:00 صباحاً وحتى 2:00 بعد منتصف الليل</span>
          </div>
        </div>

        {/* Column 4: Branches & Coverage */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 900, color: "#f59e0b", marginBottom: "4px" }}>
            فروعنا وتغطية القاهرة والجيزة
          </h4>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "#94a3b8", fontSize: "12.5px", lineHeight: 1.5 }}>
            <MapPin size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>
              <strong style={{ color: "#f8fafc" }}>فرع فيصل (المطبعة):</strong> شارع عمرو بن العاص، متفرع من فيصل، برج البدر.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "#94a3b8", fontSize: "12.5px", lineHeight: 1.5 }}>
            <MapPin size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>
              <strong style={{ color: "#f8fafc" }}>فرع ألف مسكن (جسر السويس):</strong> 2 شارع أحمد عصمت أمام نادي الشمس بوابة 4.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "#94a3b8", fontSize: "12.5px", lineHeight: 1.5 }}>
            <MapPin size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>
              <strong style={{ color: "#f8fafc" }}>فروع أخرى:</strong> 6 أكتوبر (ميدان الحصري) • حدائق القبة (مصر والسودان) • زهراء المعادي (شارع الخمسين).
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Legal Attribution Bar */}
      <div
        style={{
          maxWidth: "1320px",
          margin: "36px auto 0",
          padding: "20px 24px 0",
          borderTop: "1px solid rgba(245, 158, 11, 0.15)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "14px",
          fontSize: "12px",
          color: "#94a3b8",
        }}
      >
        <span>
          © {new Date().getFullYear()} فسيخ ورنجة الفراعنة (El-Fra3na). جميع الحقوق محفوظة.
        </span>
        <div>
          <span
            style={{
              color: "#f59e0b",
              fontWeight: 800,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            تم تطوير النظام بواسطة شركة أوركا للحلول البرمجية والخدمات السحابية 🐬
          </span>
        </div>
      </div>
    </footer>
  );
}
