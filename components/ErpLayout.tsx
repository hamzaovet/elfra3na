"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStaff } from "@/context/StaffContext";
import { useLanguage } from "@/context/LanguageContext";
import { playSound } from "@/lib/sounds";
import {
  ChefHat, UtensilsCrossed, Package, CircleDollarSign,
  Users, Store, LogOut, Shield, Settings, Bell, Globe, UserCheck,
  Menu, X, MonitorSmartphone
} from "lucide-react";
import SettingsModal from "@/components/SettingsModal";

interface ErpLayoutProps {
  children: React.ReactNode;
  activeItem?: "orders" | "menu" | "inventory" | "reports" | "users" | "customers" | "captains" | "cashier";
}

export default function ErpLayout({ children, activeItem }: ErpLayoutProps) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { currentUser, logout, permissions } = useStaff();
  const { lang, toggleLang, dir, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    function handleResize() {
      setIsMobile(window.innerWidth <= 1024);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentActive = activeItem || (
    pathname === "/dashboard" || pathname === "/kitchen" ? "orders" : pathname === "/cashier" ? "cashier"
    : pathname === "/menu-admin" || pathname === "/offers-admin" ? "menu"
    : pathname === "/inventory" ? "inventory"
    : pathname === "/reports" || pathname === "/expenses" ? "reports"
    : pathname === "/customers" ? "customers"
    : pathname === "/users" ? "users"
    : "orders"
  );

  const isOwner = currentUser?.role === "owner";
  const isManager = currentUser?.role === "manager";

  function handleTestSound() {
    playSound("order");
  }

  function handleLogout() {
    playSound("click");
    logout();
    router.push("/login");
  }

  return (
    <div dir="rtl" style={{
      minHeight: "100vh",
      background: "#071524",
      color: "#f8fafc",
      display: "flex",
      fontFamily: "var(--font-cairo), system-ui, -apple-system, sans-serif",
    }}>

      {/* Mobile Backdrop Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 998,
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside style={{
        width: isMobile ? "270px" : "250px",
        maxWidth: "85vw",
        height: "100vh",
        position: isMobile ? "fixed" : "sticky",
        top: 0,
        bottom: 0,
        right: 0,
        flexShrink: 0,
        backgroundColor: "#0d2137",
        borderLeft: "1px solid #1a3654",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        zIndex: isMobile ? 999 : 40,
        transform: isMobile
          ? mobileMenuOpen
            ? "translateX(0)"
            : "translateX(100%)"
          : "none",
        transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: isMobile && mobileMenuOpen ? "0 0 35px rgba(0,0,0,0.5)" : "none",
      }}>
        {/* Top: Brand Header & Nav Links */}
        <div>
          {/* Logo & Brand + Mobile Close */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "28px",
            padding: "0 6px",
          }}>
            <Link
              href="/"
              onClick={() => { if (isMobile) setMobileMenuOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
              }}
            >
              <div style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #071524 0%, #1a3654 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "1.5px solid #f59e0b",
                fontSize: "22px",
              }}>
                🐟
              </div>
              <div>
                <div style={{
                  fontSize: "16px",
                  fontWeight: 900,
                  color: "#f59e0b",
                  lineHeight: 1.15,
                }}>
                  فسيخ ورنجة الفراعنة
                </div>
                <div style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  color: "#94a3b8",
                  marginTop: "2px",
                }}>
                  لوحة الإدارة ونقاط البيع
                </div>
              </div>
            </Link>

            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: "rgba(245, 158, 11, 0.1)",
                  border: "none",
                  color: "#f59e0b",
                  borderRadius: "8px",
                  padding: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              {
                id: "cashier",
                href: "/cashier",
                label: "كاشير نقطة البيع (POS)",
                icon: MonitorSmartphone,
              },
              {
                id: "orders",
                href: "/dashboard",
                label: "الطلبات الحية والتشغيل",
                icon: ChefHat,
              },
              {
                id: "menu",
                href: "/menu-admin",
                label: "الأسماك وقائمة الأسعار",
                icon: UtensilsCrossed,
              },
              {
                id: "inventory",
                href: "/inventory",
                label: "المخزون والمشتريات",
                icon: Package,
              },
              {
                id: "reports",
                href: "/reports",
                label: "الخزينة والأرباح والمصروفات",
                icon: CircleDollarSign,
              },
              {
                id: "customers",
                href: "/customers",
                label: "قاعدة بيانات العملاء",
                icon: UserCheck,
              },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentActive === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    playSound("click");
                    if (isMobile) setMobileMenuOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    color: isActive ? "#071524" : "#cbd5e1",
                    backgroundColor: isActive ? "#f59e0b" : "transparent",
                    fontWeight: isActive ? 900 : 700,
                    fontSize: "13.5px",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Staff Info & Logout */}
        <div style={{
          borderTop: "1px solid #1a3654",
          paddingTop: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}>
          {currentUser && (
            <div style={{
              backgroundColor: "#071524",
              borderRadius: "10px",
              padding: "10px 12px",
              border: "1px solid #1a3654",
            }}>
              <div style={{ fontSize: "12.5px", fontWeight: 800, color: "#f8fafc" }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: "10.5px", color: "#f59e0b", marginTop: "2px", fontWeight: 700 }}>
                {currentUser.branch || "فرع فيصل الرئيسي"}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setShowSettings(true)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                backgroundColor: "#1a3654",
                border: "none",
                borderRadius: "8px",
                padding: "8px",
                color: "#cbd5e1",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Settings size={14} />
              <span>الإعدادات</span>
            </button>
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "#ef4444",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
              title="تسجيل الخروج"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        overflow: "hidden",
      }}>
        {/* Mobile Header Bar */}
        {isMobile && (
          <header style={{
            backgroundColor: "#0d2137",
            borderBottom: "1px solid #1a3654",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                background: "transparent",
                border: "none",
                color: "#f59e0b",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Menu size={24} />
            </button>
            <span style={{ fontSize: "16px", fontWeight: 900, color: "#f59e0b" }}>
              فسيخ ورنجة الفراعنة
            </span>
            <button
              onClick={handleTestSound}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <Bell size={18} />
            </button>
          </header>
        )}

        {/* Content Body */}
        <main style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </main>
      </div>

      {showSettings && <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />}
    </div>
  );
}
