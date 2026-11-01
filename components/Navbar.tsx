"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStaff } from "@/context/StaffContext";
import { playSound } from "@/lib/sounds";
import {
  Phone, MapPin, Headphones, Download, ShieldCheck,
  ShoppingBag, Menu, X, User, Globe, Flame, Smartphone, Sparkles
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, isAuthenticated } = useStaff();

  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkWidth = () => {
      setIsMobile(window.innerWidth < 880);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);

    function syncCart() {
      try {
        const raw = localStorage.getItem("captain_cart");
        if (raw) {
          const items = JSON.parse(raw);
          const totalQty = items.reduce((s: number, i: any) => s + (i.qty || 1), 0);
          const totalSum = items.reduce((s: number, i: any) => s + (i.unitPrice || 0) * (i.qty || 1), 0);
          setCartCount(totalQty);
          setCartTotal(totalSum);
        } else {
          setCartCount(0);
          setCartTotal(0);
        }
      } catch {
        setCartCount(0);
        setCartTotal(0);
      }
    }

    syncCart();
    window.addEventListener("captain_cart_update", syncCart);

    return () => {
      window.removeEventListener("resize", checkWidth);
      window.removeEventListener("captain_cart_update", syncCart);
    };
  }, []);

  function openCartModal() {
    playSound("pop");
    window.dispatchEvent(new CustomEvent("captain_open_cart"));
  }

  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "#071524",
        borderBottom: "2px solid #1a3654",
        boxShadow: "0 4px 18px rgba(0, 0, 0, 0.4)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        fontFamily: "var(--font-cairo), system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ── TOP UTILITY STRIP (Desktop only) ── */}
      {!isMobile && (
        <div
          style={{
            backgroundColor: "#050e18",
            color: "#cbd5e1",
            fontSize: "12px",
            fontWeight: 800,
            padding: "6px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(245, 158, 11, 0.15)",
          }}
        >
          {/* Branches / Location */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MapPin size={14} color="#f59e0b" />
            <span>
              فروع فسيخ ورنجة الفراعنة: فيصل (المطبعة) • ألف مسكن (جسر السويس) • 6 أكتوبر • حدائق القبة • زهراء المعادي
            </span>
          </div>

          {/* Hotlines and Service hours */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Headphones size={14} color="#f59e0b" />
              <span>خدمة العملاء والتوصيل: يومياً من 10:00 ص حتى 2:00 ص</span>
            </div>
            <a
              href="tel:01000388911"
              style={{
                color: "#f59e0b",
                textDecoration: "none",
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                direction: "ltr",
              }}
            >
              <Phone size={13} />
              <span>0100 038 8911</span>
            </a>
          </div>
        </div>
      )}

      {/* ── MAIN NAVBAR BAR ── */}
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: isMobile ? "10px 16px" : "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* RIGHT (in RTL): Brand Logo & Name */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: isMobile ? "44px" : "54px",
              height: isMobile ? "44px" : "54px",
              borderRadius: "16px",
              border: "2px solid #f59e0b",
              background: "linear-gradient(135deg, #0d2137 0%, #1a3654 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "22px" : "28px",
              boxShadow: "0 0 15px rgba(245, 158, 11, 0.2)",
            }}
          >
            🐟
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: isMobile ? "19px" : "24px",
                fontWeight: 900,
                color: "#f59e0b",
                lineHeight: 1.1,
                fontFamily: "var(--font-cairo), 'Impact', sans-serif",
                letterSpacing: "0.5px",
              }}
            >
              فسيخ ورنجة الفراعنة
            </span>
            <span
              style={{
                fontSize: isMobile ? "9.5px" : "11px",
                fontWeight: 800,
                color: "#94a3b8",
                letterSpacing: "0.5px",
              }}
            >
              EL-FRA3NA • ملوك الأسماك والبطارخ
            </span>
          </div>
        </Link>

        {/* CENTER: Navigation Links (Desktop) */}
        {!isMobile && (
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "22px",
              fontSize: "14px",
              fontWeight: 800,
            }}
          >
            <Link
              href="/"
              style={{
                color: pathname === "/" ? "#f59e0b" : "#f8fafc",
                textDecoration: "none",
                transition: "color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span>الرئيسية</span>
            </Link>

            <Link
              href="/#menu-section"
              style={{
                color: "#f8fafc",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span>قائمة الأسماك والأسعار</span>
            </Link>

            <Link
              href="/#offers-section"
              style={{
                color: "#f59e0b",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Flame size={15} color="#f59e0b" />
              <span>بوكسات العزومات 🔥</span>
            </Link>

            <Link
              href="/download"
              style={{
                color: "#f8fafc",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Smartphone size={15} color="#10b981" />
              <span>تحميل التطبيق</span>
            </Link>

            <Link
              href="/track"
              style={{
                color: "#f8fafc",
                textDecoration: "none",
              }}
            >
              <span>تتبع الأوردر 🛵</span>
            </Link>
          </nav>
        )}

        {/* LEFT (in RTL): Actions (Call hotline, Cart, Login / Staff) */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "12px" }}>
          {/* Call hotline button on Mobile */}
          {isMobile && (
            <a
              href="tel:01000388911"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                color: "#FFFFFF",
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
              }}
              title="اتصل بالدليفري"
            >
              <Phone size={16} />
            </a>
          )}

          {/* Cart Icon / Button */}
          <button
            onClick={openCartModal}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#f59e0b",
              color: "#071524",
              border: "none",
              padding: isMobile ? "8px 12px" : "8px 16px",
              borderRadius: "100px",
              fontWeight: 900,
              fontSize: isMobile ? "12px" : "13.5px",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(245, 158, 11, 0.35)",
              transition: "transform 0.15s ease",
            }}
          >
            <div style={{ position: "relative" }}>
              <ShoppingBag size={isMobile ? 16 : 18} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-7px",
                    right: "-8px",
                    backgroundColor: "#ef4444",
                    color: "#ffffff",
                    borderRadius: "50%",
                    fontSize: "10px",
                    fontWeight: 900,
                    width: "17px",
                    height: "17px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
            {!isMobile && (
              <span>
                {cartTotal > 0 ? `${cartTotal} ج.م` : "السلة"}
              </span>
            )}
          </button>

          {/* Staff Login / Profile */}
          {isAuthenticated && currentUser ? (
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#0d2137",
                border: "1px solid #1a3654",
                color: "#f59e0b",
                padding: "8px 14px",
                borderRadius: "100px",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 800,
              }}
            >
              <ShieldCheck size={14} color="#f59e0b" />
              <span>{currentUser.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#0d2137",
                border: "1px solid #1a3654",
                color: "#cbd5e1",
                padding: "8px 14px",
                borderRadius: "100px",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 800,
              }}
            >
              <User size={14} />
              <span>دخول الإدارة والـ POS</span>
            </Link>
          )}

          {/* Mobile menu toggle button */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: "transparent",
                border: "none",
                color: "#f8fafc",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* ── MOBILE MENU DROPDOWN ── */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            backgroundColor: "#071524",
            borderTop: "1px solid #1a3654",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "#f8fafc", textDecoration: "none", fontSize: "14px", fontWeight: 800 }}
          >
            الرئيسية
          </Link>
          <Link
            href="/#menu-section"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "#f8fafc", textDecoration: "none", fontSize: "14px", fontWeight: 800 }}
          >
            قائمة الأسماك والأصناف
          </Link>
          <Link
            href="/#offers-section"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "#f59e0b", textDecoration: "none", fontSize: "14px", fontWeight: 800 }}
          >
            بوكسات العزومات والميكسات 🔥
          </Link>
          <Link
            href="/download"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "#10b981", textDecoration: "none", fontSize: "14px", fontWeight: 800 }}
          >
            تحميل تطبيق الأندرويد (APK) 📱
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "#f8fafc", textDecoration: "none", fontSize: "14px", fontWeight: 800 }}
          >
            تتبع أوردر الدليفري 🛵
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px", fontWeight: 800 }}
          >
            دخول الكاشير والإدارة 🔐
          </Link>
        </div>
      )}
    </header>
  );
}
