"use client";

import React from "react";
import { Printer, X, Check, Phone, MapPin, User, Bike, Clock, Tag } from "lucide-react";
import { playSound } from "@/lib/sounds";

export interface PrintableOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address?: string | null;
  zone?: string | null;
  branch?: string | null;
  orderType?: string | null; // delivery, takeaway, pos, dinein
  status: string;
  items: string; // JSON
  subtotal: number;
  deliveryFee: number;
  total: number;
  deposit?: number;
  remaining?: number;
  paymentMethod: string;
  notes?: string | null;
  cashierName?: string | null;
  captainName?: string | null;
  captainPhone?: string | null;
  timeline?: string | null;
  createdAt: string;
}

interface ThermalReceiptModalProps {
  order: PrintableOrder | null;
  onClose: () => void;
}

export function printThermalReceipt(order: PrintableOrder) {
  playSound("click");
  const parsedItems: Array<{
    nameAr?: string;
    nameEn?: string;
    qty: number;
    unitPrice: number;
    selectedSize?: string;
    packageType?: string;
    extras?: string[];
  }> = (() => {
    try {
      return typeof order.items === "string" ? JSON.parse(order.items) : order.items;
    } catch {
      return [];
    }
  })();

  const dateObj = new Date(order.createdAt);
  const formattedDate = dateObj.toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
  const formattedTime = dateObj.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });

  const isTakeaway = order.orderType === "takeaway";
  const isPOS = order.orderType === "pos" || order.orderType === "dinein";
  const isDelivery = !isTakeaway && !isPOS;

  const orderTypeBadge = isPOS
    ? "🏬 فاتورة بيع مباشر كاشير (صالة المحل)"
    : isTakeaway
    ? "🛍️ استلام وتجهيز من الفرع (تيك أواي)"
    : "🛵 طلب توصيل سريع للمنزل (دليفري)";

  const paymentText =
    order.paymentMethod === "cash" ? "نقداً كاش 💵" :
    order.paymentMethod === "instapay" ? "إنستاباي (تحويل فوري) ⚡" :
    order.paymentMethod === "wallet" ? "محفظة إلكترونية كاش 📱" : "فيزا / كارت بنكي 💳";

  const isOrderEdited = Boolean(order.timeline && order.timeline.includes("edited"));

  const printWindow = window.open("", "_blank", "width=400,height=600");
  if (!printWindow) {
    alert("يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة الريسيت الحراري");
    return;
  }

  const receiptHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>فاتورة فسيخ ورنجة الفراعنة ${order.orderNumber}</title>
      <style>
        @page {
          size: 80mm auto;
          margin: 0;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 78mm;
          margin: 0 auto;
          padding: 8px 6px;
          font-family: 'Cairo', 'Courier New', monospace, Tahoma, sans-serif;
          font-size: 13px;
          line-height: 1.4;
          color: #000000;
          background: #ffffff;
        }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .text-lg { font-size: 16px; }
        .text-xl { font-size: 18px; }
        .divider {
          border-top: 1px dashed #000000;
          margin: 6px 0;
        }
        .double-divider {
          border-top: 2px solid #000000;
          margin: 8px 0;
        }
        .flex-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 6px 0;
        }
        .items-table th {
          border-bottom: 1px solid #000000;
          padding: 4px 0;
          font-size: 12px;
        }
        .items-table td {
          padding: 4px 0;
          vertical-align: top;
        }
        .extra-line {
          font-size: 11px;
          padding-right: 14px;
        }
        .total-box {
          font-size: 16px;
          font-weight: 900;
          padding: 6px 0;
        }
        .footer-note {
          font-size: 11px;
          text-align: center;
          margin-top: 8px;
        }
      </style>
    </head>
    <body onload="window.print(); setTimeout(() => window.close(), 500);">
      <div class="text-center">
        <div style="font-size: 26px; margin-bottom: 4px;">🐟 👑</div>
        <div style="font-size: 18px; font-weight: 900; letter-spacing: 0.5px;">فسيخ ورنجة الفراعنة</div>
        <div style="font-size: 11px; font-weight: 700; color: #333;">ملوك الأسماك المملحة والمدخنة والبطارخ منذ 1990</div>
        <div style="font-size: 11px; color: #222; margin-top: 2px;">${order.branch || "فرع فيصل الرئيسي (المطبعة)"}</div>
        <div style="font-size: 12px; font-weight: bold; margin-top: 2px;">الخط الساخن: 01000388911 | واتساب: 01069717413</div>
      </div>

      <div class="double-divider"></div>

      <div class="flex-between">
        <span class="font-bold text-lg">فاتورة رقم: #${order.orderNumber}</span>
        ${isOrderEdited ? '<span style="border: 1px solid #000; padding: 1px 4px; font-size: 10px; font-weight: bold;">معدلة</span>' : ''}
      </div>

      <div class="flex-between" style="font-size: 11px; margin-top: 2px;">
        <span>التاريخ: ${formattedDate}</span>
        <span>الوقت: ${formattedTime}</span>
      </div>

      ${order.cashierName ? `
        <div style="font-size: 11px; margin-top: 2px;">
          <span>الكاشير: <strong>${order.cashierName}</strong></span>
        </div>
      ` : ''}

      <div style="margin-top: 4px; font-weight: bold; font-size: 12px; background: #eee; padding: 2px 4px; text-align: center;">
        ${orderTypeBadge}
      </div>

      <div class="divider"></div>

      <div style="font-size: 12px;">
        <div>العميل: <strong>${order.customerName || "عميل كريم"}</strong></div>
        <div>الهاتف: <strong dir="ltr">${order.phone}</strong></div>
        ${order.address ? `<div>العنوان: <strong>${order.address}</strong></div>` : ''}
        ${order.zone ? `<div>المنطقة: <strong>${order.zone}</strong></div>` : ''}
        ${order.captainName ? `<div>الطيار: <strong>${order.captainName} (${order.captainPhone || ''})</strong></div>` : ''}
      </div>

      <div class="divider"></div>

      <table class="items-table">
        <thead>
          <tr>
            <th class="text-right" style="width: 50%;">الصنف / التجهيز</th>
            <th class="text-center" style="width: 15%;">الكمية</th>
            <th class="text-center" style="width: 15%;">السعر</th>
            <th class="text-left" style="width: 20%;">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${parsedItems.map(item => `
            <tr>
              <td class="text-right">
                <strong>${item.nameAr || item.nameEn}</strong>
                ${item.selectedSize ? `<div style="font-size: 10px; color: #444;">الحجم: ${item.selectedSize}</div>` : ''}
                ${item.packageType ? `<div style="font-size: 10px; color: #444;">التجهيز: ${item.packageType}</div>` : ''}
              </td>
              <td class="text-center font-bold">${item.qty}</td>
              <td class="text-center">${item.unitPrice}</td>
              <td class="text-left font-bold">${(item.unitPrice * item.qty).toFixed(0)}</td>
            </tr>
            ${item.extras && item.extras.length > 0 ? `
              <tr>
                <td colspan="4" class="extra-line text-right">
                  + ${item.extras.join("، ")}
                </td>
              </tr>
            ` : ''}
          `).join("")}
        </tbody>
      </table>

      <div class="divider"></div>

      <div class="flex-between">
        <span>المجموع الفرعي:</span>
        <span class="font-bold">${order.subtotal.toFixed(0)} ج.م</span>
      </div>

      ${isDelivery ? `
        <div class="flex-between">
          <span>خدمة التوصيل السريع:</span>
          <span class="font-bold">${order.deliveryFee > 0 ? `${order.deliveryFee.toFixed(0)} ج.م` : 'مجاناً'}</span>
        </div>
      ` : ''}

      <div class="double-divider"></div>

      <div class="flex-between total-box">
        <span>الإجمالي النهائي المستحق:</span>
        <span style="font-size: 18px;">${order.total.toFixed(0)} ج.م</span>
      </div>

      <div class="flex-between" style="font-size: 12px; margin-top: 4px;">
        <span>طريقة الدفع:</span>
        <span class="font-bold">${paymentText}</span>
      </div>

      ${order.notes ? `
        <div class="divider"></div>
        <div style="font-size: 11px;">
          <strong>ملاحظات التحضير:</strong> ${order.notes}
        </div>
      ` : ''}

      <div class="double-divider"></div>

      <div class="footer-note">
        <div style="font-weight: bold; font-size: 12px;">ألف هنا وشفا يا فندم! 🐟</div>
        <div>نوصي بحفظ الأسماك في الفريزر أو استهلاكها فوراً بعد الفتح</div>
        <div style="margin-top: 4px; font-size: 10px; color: #555;">شكراً لاختياركم فسيخ ورنجة الفراعنة</div>
        <div style="font-size: 9px; margin-top: 3px; color: #777;">تم إصدار الفاتورة إلكترونياً بواسطة نظام شركة أوركا السحابي</div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(receiptHtml);
  printWindow.document.close();
}

export default function ThermalReceiptModal({ order, onClose }: ThermalReceiptModalProps) {
  if (!order) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#0d2137",
          border: "2px solid #f59e0b",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
          overflow: "hidden",
          color: "#f8fafc",
          fontFamily: "var(--font-cairo), sans-serif",
          direction: "rtl",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            backgroundColor: "#071524",
            borderBottom: "1px solid #1a3654",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>🧾</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 900, color: "#f59e0b" }}>
                طباعة الفاتورة الحرارية
              </h3>
              <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                طلب رقم #{order.orderNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Preview */}
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              backgroundColor: "#071524",
              borderRadius: "12px",
              padding: "14px",
              border: "1px dashed #1a3654",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "13px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#94a3b8" }}>العميل:</span>
              <span style={{ fontWeight: 800 }}>{order.customerName}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#94a3b8" }}>الهاتف:</span>
              <span style={{ fontWeight: 800 }} dir="ltr">{order.phone}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#94a3b8" }}>إجمالي الفاتورة:</span>
              <span style={{ fontWeight: 900, color: "#f59e0b", fontSize: "15px" }}>
                {order.total} ج.م
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => printThermalReceipt(order)}
              style={{
                flex: 1,
                backgroundColor: "#f59e0b",
                color: "#071524",
                border: "none",
                borderRadius: "12px",
                padding: "12px",
                fontWeight: 900,
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(245, 158, 11, 0.35)",
              }}
            >
              <Printer size={18} />
              <span>طباعة الريسيت 80mm</span>
            </button>
            <button
              onClick={onClose}
              style={{
                backgroundColor: "#1a3654",
                color: "#cbd5e1",
                border: "none",
                borderRadius: "12px",
                padding: "12px 18px",
                fontWeight: 800,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
